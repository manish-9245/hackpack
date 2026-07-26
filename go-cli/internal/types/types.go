// Package types mirrors cli/src/types.ts field-for-field so the Go CLI reads
// and writes the exact same JSON shapes as the TS CLI.
package types

type WiringInsert struct {
	File   string `json:"file"`
	Anchor string `json:"anchor"`
	Insert string `json:"insert"`
}

type EnvVar struct {
	Key     string `json:"key"`
	Value   string `json:"value"`
	Comment string `json:"comment,omitempty"`
}

type TemplateManifest struct {
	Name             string            `json:"name"`
	Type             string            `json:"type"`
	Description      string            `json:"description,omitempty"`
	Category         string            `json:"category,omitempty"`
	CompatibleWith   []string          `json:"compatibleWith,omitempty"`
	RequiresCategory string            `json:"requiresCategory,omitempty"`
	HasVariants      bool              `json:"hasVariants,omitempty"`
	Dependencies     map[string]string `json:"dependencies,omitempty"`
	DevDependencies  map[string]string `json:"devDependencies,omitempty"`
	Scripts          map[string]string `json:"scripts,omitempty"`
	PyDependencies   []string          `json:"pyDependencies,omitempty"`
	EnvVars          []EnvVar          `json:"envVars,omitempty"`
	Wiring           []WiringInsert    `json:"wiring,omitempty"`
	PostInstall      []string          `json:"postInstall,omitempty"`
	ComponentsNeeded []string          `json:"componentsNeeded,omitempty"`
}

// InstalledPage mirrors `{ name: string; variant: string | null }`. Variant is a
// pointer so JSON null round-trips distinctly from the absent/empty string.
type InstalledPage struct {
	Name    string  `json:"name"`
	Variant *string `json:"variant"`
}

type HackpackManifest struct {
	Base      string          `json:"base"`
	Features  []string        `json:"features"`
	Pages     []InstalledPage `json:"pages"`
	CreatedAt string          `json:"createdAt"`
}

type LockBase struct {
	Name   string `json:"name"`
	Source string `json:"source"`
}

type LockRef struct {
	Name   string `json:"name"`
	Source string `json:"source"`
}

type LockPage struct {
	Name    string  `json:"name"`
	Variant *string `json:"variant"`
	Source  string  `json:"source"`
}

type HackpackLock struct {
	Registry   string     `json:"registry"`
	ResolvedAt string     `json:"resolvedAt"`
	Base       LockBase   `json:"base"`
	Features   []LockRef  `json:"features"`
	Pages      []LockPage `json:"pages"`
}
