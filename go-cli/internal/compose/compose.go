// Package compose ports cli/src/compose.ts: layered file copy, dependency
// merge, env var append, and anchor wiring — the actual project-composition
// algorithm shared by `new` and `add`.
package compose

import (
	"fmt"
	"path/filepath"
	"time"

	"hackpack/internal/fsutil"
	"hackpack/internal/registry"
	"hackpack/internal/types"
)

type Options struct {
	RegistryPath  string
	RegistryLabel string
	TargetDir     string
	ProjectName   string
	Base          string
	Features      []string
	Pages         []string
}

type Result struct {
	PostInstall []string
}

// mergeManifestDeps ports the same-named helper in compose.ts: JS bases merge
// into package.json, Python bases merge into pyproject.toml. A manifest just
// declares whichever field(s) apply to its language.
func mergeManifestDeps(targetDir string, manifest types.TemplateManifest) error {
	if manifest.Dependencies != nil || manifest.DevDependencies != nil || manifest.Scripts != nil {
		patch := map[string]interface{}{}
		if manifest.Dependencies != nil {
			patch["dependencies"] = manifest.Dependencies
		}
		if manifest.DevDependencies != nil {
			patch["devDependencies"] = manifest.DevDependencies
		}
		if manifest.Scripts != nil {
			patch["scripts"] = manifest.Scripts
		}
		if err := fsutil.MergeJsonFile(filepath.Join(targetDir, "package.json"), patch); err != nil {
			return err
		}
	}
	if len(manifest.PyDependencies) > 0 {
		if err := fsutil.MergeTomlDependencyArray(filepath.Join(targetDir, "pyproject.toml"), "dependencies", manifest.PyDependencies); err != nil {
			return err
		}
	}
	return nil
}

// copyLayeredFiles ports the same-named helper: shared files/ first, then an
// optional files-<base>/ overlay for framework-specific integration code.
func copyLayeredFiles(templateRoot, base, targetDir string, vars map[string]interface{}) error {
	shared := filepath.Join(templateRoot, "files")
	if fsutil.PathExists(shared) {
		if err := fsutil.CopyTemplateDir(shared, targetDir, vars); err != nil {
			return err
		}
	}
	overlay := filepath.Join(templateRoot, "files-"+base)
	if fsutil.PathExists(overlay) {
		if err := fsutil.CopyTemplateDir(overlay, targetDir, vars); err != nil {
			return err
		}
	}
	return nil
}

type ApplyFeatureResult struct {
	PostInstall []string
	Category    string
}

// ApplyFeature layers one feature's files/deps/env/wiring onto an existing
// project directory. Shared by compose() (new project) and the `add` command.
func ApplyFeature(registryPath, targetDir, base, featureName string, vars map[string]interface{}) (ApplyFeatureResult, error) {
	manifest, err := registry.LoadManifest(registryPath, "feature", featureName)
	if err != nil {
		return ApplyFeatureResult{}, err
	}
	if len(manifest.CompatibleWith) > 0 && !contains(manifest.CompatibleWith, base) {
		return ApplyFeatureResult{}, fmt.Errorf("feature %q is not compatible with base %q", featureName, base)
	}

	if err := copyLayeredFiles(registry.TemplateDir(registryPath, "feature", featureName), base, targetDir, vars); err != nil {
		return ApplyFeatureResult{}, err
	}
	if err := mergeManifestDeps(targetDir, manifest); err != nil {
		return ApplyFeatureResult{}, err
	}
	if len(manifest.EnvVars) > 0 {
		evs := make([]fsutil.EnvVarLike, len(manifest.EnvVars))
		for i, e := range manifest.EnvVars {
			evs[i] = fsutil.EnvVarLike{Key: e.Key, Value: e.Value, Comment: e.Comment}
		}
		if err := fsutil.AppendEnvVars(filepath.Join(targetDir, ".env.example"), evs); err != nil {
			return ApplyFeatureResult{}, err
		}
	}
	for _, w := range manifest.Wiring {
		if err := fsutil.InsertAtAnchor(filepath.Join(targetDir, w.File), w.Anchor, w.Insert); err != nil {
			return ApplyFeatureResult{}, err
		}
	}

	return ApplyFeatureResult{PostInstall: manifest.PostInstall, Category: manifest.Category}, nil
}

func contains(list []string, v string) bool {
	for _, s := range list {
		if s == v {
			return true
		}
	}
	return false
}

func Compose(opts Options) (Result, error) {
	vars := map[string]interface{}{"projectName": opts.ProjectName}
	var postInstall []string

	baseManifest, err := registry.LoadManifest(opts.RegistryPath, "base", opts.Base)
	if err != nil {
		return Result{}, err
	}
	if err := fsutil.CopyTemplateDir(registry.TemplateDir(opts.RegistryPath, "base", opts.Base), opts.TargetDir, vars); err != nil {
		return Result{}, err
	}
	postInstall = append(postInstall, baseManifest.PostInstall...)

	// installedCategories lets pages find "whichever auth feature was installed",
	// per the plan's "compose with selected auth feature, not a fixed default".
	installedCategories := map[string]string{}

	for _, feature := range opts.Features {
		result, err := ApplyFeature(opts.RegistryPath, opts.TargetDir, opts.Base, feature, vars)
		if err != nil {
			return Result{}, err
		}
		if result.Category != "" {
			installedCategories[result.Category] = feature
		}
		postInstall = append(postInstall, result.PostInstall...)
	}

	installedPages := []types.InstalledPage{}
	for _, page := range opts.Pages {
		manifest, err := registry.LoadManifest(opts.RegistryPath, "page", page)
		if err != nil {
			return Result{}, err
		}
		if len(manifest.CompatibleWith) > 0 && !contains(manifest.CompatibleWith, opts.Base) {
			return Result{}, fmt.Errorf("page %q is not compatible with base %q", page, opts.Base)
		}

		var variant *string
		if manifest.RequiresCategory != "" {
			v := installedCategories[manifest.RequiresCategory]
			if v == "" {
				v = "none"
			}
			variant = &v
		}

		pageRoot := registry.TemplateDir(opts.RegistryPath, "page", page)
		sourceRoot := pageRoot
		if manifest.HasVariants {
			variantName := "none"
			if variant != nil {
				variantName = *variant
			}
			sourceRoot = filepath.Join(pageRoot, "variants", variantName)
		}

		pageVars := map[string]interface{}{"projectName": opts.ProjectName, "entityName": page}
		if err := copyLayeredFiles(sourceRoot, opts.Base, opts.TargetDir, pageVars); err != nil {
			return Result{}, err
		}
		if err := mergeManifestDeps(opts.TargetDir, manifest); err != nil {
			return Result{}, err
		}
		for _, w := range manifest.Wiring {
			if err := fsutil.InsertAtAnchor(filepath.Join(opts.TargetDir, w.File), w.Anchor, w.Insert); err != nil {
				return Result{}, err
			}
		}
		installedPages = append(installedPages, types.InstalledPage{Name: page, Variant: variant})
	}

	now := time.Now().UTC().Format("2006-01-02T15:04:05.000Z")

	features := opts.Features
	if features == nil {
		features = []string{}
	}
	hackpackJSON := types.HackpackManifest{
		Base:      opts.Base,
		Features:  features,
		Pages:     installedPages,
		CreatedAt: now,
	}
	if err := fsutil.WriteJSONFile(filepath.Join(opts.TargetDir, "hackpack.json"), hackpackJSON); err != nil {
		return Result{}, err
	}

	lockFeatures := make([]types.LockRef, len(opts.Features))
	for i, f := range opts.Features {
		lockFeatures[i] = types.LockRef{Name: f, Source: opts.RegistryLabel}
	}
	lockPages := make([]types.LockPage, len(installedPages))
	for i, p := range installedPages {
		lockPages[i] = types.LockPage{Name: p.Name, Variant: p.Variant, Source: opts.RegistryLabel}
	}
	if lockFeatures == nil {
		lockFeatures = []types.LockRef{}
	}
	if lockPages == nil {
		lockPages = []types.LockPage{}
	}
	lock := types.HackpackLock{
		Registry:   opts.RegistryLabel,
		ResolvedAt: now,
		Base:       types.LockBase{Name: opts.Base, Source: opts.RegistryLabel},
		Features:   lockFeatures,
		Pages:      lockPages,
	}
	if err := fsutil.WriteJSONFile(filepath.Join(opts.TargetDir, "hackpack.lock"), lock); err != nil {
		return Result{}, err
	}

	return Result{PostInstall: dedupe(postInstall)}, nil
}

func dedupe(items []string) []string {
	seen := map[string]bool{}
	out := []string{}
	for _, i := range items {
		if !seen[i] {
			seen[i] = true
			out = append(out, i)
		}
	}
	return out
}
