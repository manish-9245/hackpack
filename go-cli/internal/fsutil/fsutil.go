// Package fsutil ports cli/src/fsutil.ts: template-dir copy (with Handlebars
// rendering of .hbs files via raymond), the anchor-comment insert mechanism,
// and the JSON / TOML-array merge helpers. Behavior is a deliberate 1:1 port,
// including the narrow regex-based TOML edit and the "skip undefined values"
// JSON-merge rule (see mergeManifestDeps in compose.go), so both CLIs treat
// the same registry the same way.
package fsutil

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/aymerick/raymond"
)

func PathExists(p string) bool {
	_, err := os.Stat(p)
	return err == nil
}

func IsDir(p string) bool {
	info, err := os.Stat(p)
	return err == nil && info.IsDir()
}

// CopyTemplateDir recursively copies src into dest. Files ending in .hbs are
// rendered with raymond (Handlebars) using vars and written without the .hbs
// suffix; everything else is copied byte-for-byte. template.config.json /
// page.config.json are never copied (they're registry metadata, not project
// files).
func CopyTemplateDir(src, dest string, vars map[string]interface{}) error {
	entries, err := os.ReadDir(src)
	if err != nil {
		return err
	}
	if err := os.MkdirAll(dest, 0755); err != nil {
		return err
	}
	for _, entry := range entries {
		name := entry.Name()
		if name == "template.config.json" || name == "page.config.json" {
			continue
		}
		from := filepath.Join(src, name)
		to := filepath.Join(dest, name)
		if entry.IsDir() {
			if err := CopyTemplateDir(from, to, vars); err != nil {
				return err
			}
			continue
		}
		if strings.HasSuffix(name, ".hbs") {
			raw, err := os.ReadFile(from)
			if err != nil {
				return err
			}
			rendered, err := raymond.Render(string(raw), vars)
			if err != nil {
				return fmt.Errorf("rendering %s: %w", from, err)
			}
			if err := os.WriteFile(to[:len(to)-4], []byte(rendered), 0644); err != nil {
				return err
			}
			continue
		}
		if err := copyFile(from, to); err != nil {
			return err
		}
	}
	return nil
}

func copyFile(from, to string) error {
	info, err := os.Stat(from)
	if err != nil {
		return err
	}
	data, err := os.ReadFile(from)
	if err != nil {
		return err
	}
	return os.WriteFile(to, data, info.Mode().Perm())
}

// InsertAtAnchor inserts content immediately above the line containing anchor,
// indenting it with whatever leading text preceded the anchor on that line,
// and leaves the anchor line itself untouched so later composes can insert
// again at the same spot. content may itself contain embedded "\n" for a
// multi-line insert; only its first line receives the indent (matches the TS
// implementation, which splices one array element that happens to contain
// newlines and then joins the whole file back with "\n").
func InsertAtAnchor(filePath, anchor, content string) error {
	raw, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}
	lines := strings.Split(string(raw), "\n")
	idx := -1
	for i, l := range lines {
		if strings.Contains(l, anchor) {
			idx = i
			break
		}
	}
	if idx == -1 {
		return fmt.Errorf("anchor %q not found in %s", anchor, filePath)
	}
	indent := lines[idx][:strings.Index(lines[idx], anchor)]
	inserted := indent + content
	lines = append(lines, "")
	copy(lines[idx+1:], lines[idx:])
	lines[idx] = inserted
	return os.WriteFile(filePath, []byte(strings.Join(lines, "\n")), 0644)
}

// InsertAtAnchorSafe is the best-effort variant used for optional wiring
// targets (e.g. a nav component that only exists if some other feature/page
// installed it). Returns whether the insert happened instead of erroring.
func InsertAtAnchorSafe(filePath, anchor, content string) bool {
	return InsertAtAnchor(filePath, anchor, content) == nil
}

// writeJSON writes v as 2-space-indented JSON with a trailing newline and no
// HTML-escaping (package.json scripts routinely contain "&&", which Go's
// default encoder would otherwise mangle into &).
func writeJSON(filePath string, v interface{}) error {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(v); err != nil {
		return err
	}
	return os.WriteFile(filePath, buf.Bytes(), 0644)
}

func WriteJSONFile(filePath string, v interface{}) error {
	return writeJSON(filePath, v)
}

// MergeJsonFile ports mergeJsonFile from fsutil.ts: for each key in patch,
// nil/absent values are skipped entirely (this is the exact bug fix being
// replicated — merging an absent value must never clobber a key already
// merged by an earlier feature), object values are shallow-merged into the
// existing object at that key, everything else overwrites.
func MergeJsonFile(filePath string, patch map[string]interface{}) error {
	raw, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}
	var doc map[string]interface{}
	if err := json.Unmarshal(raw, &doc); err != nil {
		return err
	}
	for key, value := range patch {
		if value == nil {
			continue
		}
		if obj, ok := asStringMap(value); ok {
			existing, _ := asStringMap(doc[key])
			if existing == nil {
				existing = map[string]interface{}{}
			}
			for k, v := range obj {
				existing[k] = v
			}
			doc[key] = existing
		} else {
			doc[key] = value
		}
	}
	return writeJSON(filePath, doc)
}

func asStringMap(v interface{}) (map[string]interface{}, bool) {
	switch m := v.(type) {
	case map[string]interface{}:
		return m, true
	case map[string]string:
		out := make(map[string]interface{}, len(m))
		for k, vv := range m {
			out[k] = vv
		}
		return out, true
	default:
		return nil, false
	}
}

var pkgNameSplit = regexp.MustCompile(`[=<>~!\[; ]`)

func pkgNameOf(spec string) string {
	parts := pkgNameSplit.Split(spec, 2)
	return strings.ToLower(strings.TrimSpace(parts[0]))
}

// MergeTomlDependencyArray ports mergeTomlDependencyArray from fsutil.ts: a
// deliberately narrow regex edit (not a full TOML parse) of a single
// contiguous `key = [ ... ]` array, skipping items already present by
// package name (ignoring version specifiers).
func MergeTomlDependencyArray(filePath, key string, items []string) error {
	if len(items) == 0 {
		return nil
	}
	raw, err := os.ReadFile(filePath)
	if err != nil {
		return err
	}
	text := string(raw)
	re := regexp.MustCompile(regexp.QuoteMeta(key) + `\s*=\s*\[([^\]]*)\]`)
	loc := re.FindStringSubmatchIndex(text)
	if loc == nil {
		return fmt.Errorf("could not find %q = [...] in %s", key, filePath)
	}
	matchStart, matchEnd := loc[0], loc[1]
	groupStart, groupEnd := loc[2], loc[3]
	group := text[groupStart:groupEnd]

	strRe := regexp.MustCompile(`"([^"]+)"`)
	existingMatches := strRe.FindAllStringSubmatch(group, -1)
	existing := make([]string, 0, len(existingMatches))
	existingNames := map[string]bool{}
	for _, m := range existingMatches {
		existing = append(existing, m[1])
		existingNames[pkgNameOf(m[1])] = true
	}

	var toAdd []string
	for _, item := range items {
		if !existingNames[pkgNameOf(item)] {
			toAdd = append(toAdd, item)
		}
	}
	if len(toAdd) == 0 {
		return nil
	}

	merged := append(append([]string{}, existing...), toAdd...)
	var sb strings.Builder
	sb.WriteString(key)
	sb.WriteString(" = [\n")
	for _, m := range merged {
		sb.WriteString("    \"")
		sb.WriteString(m)
		sb.WriteString("\",\n")
	}
	sb.WriteString("]")

	rebuilt := text[:matchStart] + sb.String() + text[matchEnd:]
	return os.WriteFile(filePath, []byte(rebuilt), 0644)
}

type EnvVarLike struct {
	Key     string
	Value   string
	Comment string
}

// AppendEnvVars ports appendEnvVars from fsutil.ts.
func AppendEnvVars(filePath string, vars []EnvVarLike) error {
	if len(vars) == 0 {
		return nil
	}
	var existing string
	if PathExists(filePath) {
		raw, err := os.ReadFile(filePath)
		if err != nil {
			return err
		}
		existing = string(raw)
	}
	lines := make([]string, 0, len(vars))
	for _, v := range vars {
		if v.Comment != "" {
			lines = append(lines, fmt.Sprintf("# %s\n%s=%s", v.Comment, v.Key, v.Value))
		} else {
			lines = append(lines, fmt.Sprintf("%s=%s", v.Key, v.Value))
		}
	}
	sep := ""
	if existing != "" && !strings.HasSuffix(existing, "\n") {
		sep = "\n"
	}
	return os.WriteFile(filePath, []byte(existing+sep+strings.Join(lines, "\n")+"\n"), 0644)
}
