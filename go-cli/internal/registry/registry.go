// Package registry ports cli/src/registry.ts's registry resolution and
// manifest loading.
//
// Bundled-default resolution differs deliberately from the TS CLI: the TS CLI
// resolves "../templates" relative to its own installed file location (import.meta.url).
// A single static Go binary has no equivalent "where was I installed from" signal once
// copied elsewhere, so instead we: (1) honor $HACKPACK_REGISTRY if set, then (2) probe a
// short list of paths relative to the running binary and the cwd, covering the common
// case of running the freshly-built binary from within go-cli/ next to a sibling
// templates/ directory. If none of those exist, --registry must be passed explicitly.
//
// Remote git registries ("github:org/repo" via git CLI) are supported.
// They are cloned to ~/.hackpack/cache/<digest> and reused across runs.
package registry

import (
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"

	"hackpack/internal/config"
	"hackpack/internal/fsutil"
	"hackpack/internal/types"
)

var kindDir = map[string]string{
	"base":    "bases",
	"feature": "features",
	"page":    "pages",
}

// ResolveRegistry resolves a registry argument (as passed to --registry) to a
// local directory. Empty string means "use the bundled default".
// Supports local paths and remote git URLs (github:org/repo, gitlab:, https://).
func ResolveRegistry(registryArg string) (string, error) {
	if registryArg == "" {
		return resolveBundledDefault()
	}

	cfg, err := config.Read()
	if err != nil {
		return "", err
	}
	source := registryArg
	if named, ok := cfg.Registries[registryArg]; ok {
		source = named
	}

	// Try local path first
	localPath := source
	if !filepath.IsAbs(localPath) {
		cwd, err := os.Getwd()
		if err != nil {
			return "", err
		}
		localPath = filepath.Join(cwd, localPath)
	}
	if fsutil.IsDir(localPath) {
		return localPath, nil
	}

	// Try remote git URL
	if isGitURL(source) {
		return resolveGitRegistry(source)
	}

	return "", fmt.Errorf(
		"registry source %q is not found. Expected a local directory or a git URL "+
			"(github:org/repo, gitlab:org/repo, or https://...)",
		source,
	)
}

func resolveBundledDefault() (string, error) {
	if env := os.Getenv("HACKPACK_REGISTRY"); env != "" {
		if fsutil.IsDir(env) {
			return env, nil
		}
		return "", fmt.Errorf("HACKPACK_REGISTRY=%q is not a directory", env)
	}

	var candidates []string
	if exe, err := os.Executable(); err == nil {
		if exe, err = filepath.EvalSymlinks(exe); err == nil {
			exeDir := filepath.Dir(exe)
			candidates = append(candidates,
				filepath.Join(exeDir, "templates"),
				filepath.Join(exeDir, "..", "templates"),
				filepath.Join(exeDir, "..", "..", "templates"),
			)
		}
	}
	if cwd, err := os.Getwd(); err == nil {
		candidates = append(candidates,
			filepath.Join(cwd, "templates"),
			filepath.Join(cwd, "..", "templates"),
		)
	}

	for _, c := range candidates {
		if fsutil.IsDir(c) {
			return c, nil
		}
	}
	return "", fmt.Errorf(
		"couldn't find a bundled templates/ registry near the hackpack binary or cwd " +
			"(tried binary-relative and cwd-relative ../templates, templates/). " +
			"Pass --registry=<path> explicitly or set HACKPACK_REGISTRY=<path>",
	)
}

func ListTemplates(registryPath, kind string) ([]types.TemplateManifest, error) {
	dir := filepath.Join(registryPath, kindDir[kind])
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, nil // mirrors TS: readdir failure -> empty list
	}
	var out []types.TemplateManifest
	for _, e := range entries {
		if !e.IsDir() {
			continue
		}
		m, err := LoadManifest(registryPath, kind, e.Name())
		if err != nil {
			continue
		}
		out = append(out, m)
	}
	return out, nil
}

func LoadManifest(registryPath, kind, name string) (types.TemplateManifest, error) {
	configName := "template.config.json"
	if kind == "page" {
		configName = "page.config.json"
	}
	p := filepath.Join(registryPath, kindDir[kind], name, configName)
	raw, err := os.ReadFile(p)
	if err != nil {
		return types.TemplateManifest{}, err
	}
	var m types.TemplateManifest
	if err := json.Unmarshal(raw, &m); err != nil {
		return types.TemplateManifest{}, err
	}
	return m, nil
}

func TemplateDir(registryPath, kind, name string) string {
	return filepath.Join(registryPath, kindDir[kind], name)
}

// isGitURL returns true if source looks like a git URL.
func isGitURL(source string) bool {
	return strings.HasPrefix(source, "github:") ||
		strings.HasPrefix(source, "gitlab:") ||
		strings.HasPrefix(source, "https://") ||
		strings.HasPrefix(source, "http://") ||
		strings.HasPrefix(source, "git@")
}

// resolveGitRegistry clones a git repository to ~/.hackpack/cache/<digest> and returns the path.
func resolveGitRegistry(source string) (string, error) {
	// Convert shorthand (github:org/repo) to full URL
	gitURL := normalizeGitURL(source)

	// Compute cache key from URL
	hash := sha1.Sum([]byte(gitURL))
	digest := hex.EncodeToString(hash[:])

	cacheDir := filepath.Join(config.CACHE_DIR, digest)
	if fsutil.IsDir(cacheDir) {
		// Cache hit: update and return
		cmd := exec.Command("git", "-C", cacheDir, "pull", "--quiet")
		_ = cmd.Run() // Ignore errors on pull (offline OK, repo might be read-only)
		return cacheDir, nil
	}

	// Cache miss: clone the repo
	if err := os.MkdirAll(filepath.Dir(cacheDir), 0755); err != nil {
		return "", fmt.Errorf("failed to create cache directory: %w", err)
	}

	cmd := exec.Command("git", "clone", "--quiet", gitURL, cacheDir)
	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("failed to clone git registry %q: %w", gitURL, err)
	}

	return cacheDir, nil
}

// normalizeGitURL converts shorthand (github:org/repo) to full git URLs.
func normalizeGitURL(source string) string {
	switch {
	case strings.HasPrefix(source, "github:"):
		repo := strings.TrimPrefix(source, "github:")
		return "https://github.com/" + repo + ".git"
	case strings.HasPrefix(source, "gitlab:"):
		repo := strings.TrimPrefix(source, "gitlab:")
		return "https://gitlab.com/" + repo + ".git"
	default:
		return source
	}
}
