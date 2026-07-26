// Package generate ports cli/src/generate.ts: the `hackpack page add`
// CRUD-scaffold generator, driven by raymond (Handlebars) for file bodies and
// plain string substitution (not Handlebars) for target paths and wiring
// file/insert strings — matching the TS implementation's `substitute()`,
// which is a literal .replaceAll, not a Handlebars.compile call.
package generate

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/aymerick/raymond"

	"hackpack/internal/fsutil"
)

func init() {
	raymond.RegisterHelper("pascal", func(s string) string {
		if s == "" {
			return s
		}
		return strings.ToUpper(s[:1]) + s[1:]
	})
}

type FieldType string

const (
	FieldString   FieldType = "string"
	FieldNumber   FieldType = "number"
	FieldBoolean  FieldType = "boolean"
	FieldDate     FieldType = "date"
	FieldRelation FieldType = "relation"
)

var ValidFieldTypes = []FieldType{FieldString, FieldNumber, FieldBoolean, FieldDate, FieldRelation}

type FieldSpec struct {
	Name string
	Type FieldType
}

var tsType = map[FieldType]string{
	FieldString: "string", FieldNumber: "number", FieldBoolean: "boolean",
	FieldDate: "string", FieldRelation: "string",
}
var zodType = map[FieldType]string{
	FieldString: "z.string()", FieldNumber: "z.number()", FieldBoolean: "z.boolean()",
	FieldDate: "z.string()", FieldRelation: "z.string()",
}
var pyType = map[FieldType]string{
	FieldString: "str", FieldNumber: "float", FieldBoolean: "bool",
	FieldDate: "str", FieldRelation: "str",
}
var sqlType = map[FieldType]string{
	FieldString: "TEXT", FieldNumber: "REAL", FieldBoolean: "INTEGER",
	FieldDate: "TEXT", FieldRelation: "TEXT",
}

func drizzleColumn(name string, t FieldType) string {
	switch t {
	case FieldNumber:
		return fmt.Sprintf(`%s: real("%s")`, name, name)
	case FieldBoolean:
		return fmt.Sprintf(`%s: integer("%s", { mode: "boolean" })`, name, name)
	case FieldDate:
		return fmt.Sprintf(`%s: integer("%s", { mode: "timestamp" })`, name, name)
	default:
		return fmt.Sprintf(`%s: text("%s")`, name, name)
	}
}

type scaffoldWiring struct {
	File     string `json:"file"`
	Anchor   string `json:"anchor"`
	Insert   string `json:"insert"`
	Optional bool   `json:"optional,omitempty"`
}

type scaffoldConfig struct {
	Language  string            `json:"language"`
	Templates map[string]string `json:"templates"`
	Wiring    []scaffoldWiring  `json:"wiring"`
}

type Options struct {
	RegistryPath string
	TargetDir    string
	Base         string
	EntityName   string
	Fields       []FieldSpec
	Auth         string // "protected" | "public"
}

type Result struct {
	FilesWritten  []string
	WiringApplied []string
	WiringSkipped []string
}

func substitute(pattern, entityName, entityNamePascal string) string {
	pattern = strings.ReplaceAll(pattern, "{{entityName}}", entityName)
	pattern = strings.ReplaceAll(pattern, "{{entityNamePascal}}", entityNamePascal)
	return pattern
}

func GeneratePage(opts Options) (Result, error) {
	scaffoldDir := filepath.Join(opts.RegistryPath, "pages", "_scaffold", opts.Base)
	configPath := filepath.Join(scaffoldDir, "scaffold.config.json")
	if !fsutil.PathExists(configPath) {
		return Result{}, fmt.Errorf("no page-add scaffold available for base %q", opts.Base)
	}
	raw, err := os.ReadFile(configPath)
	if err != nil {
		return Result{}, err
	}
	var cfg scaffoldConfig
	if err := json.Unmarshal(raw, &cfg); err != nil {
		return Result{}, err
	}

	entityName := opts.EntityName
	entityNamePascal := strings.ToUpper(entityName[:1]) + entityName[1:]

	renderedFields := make([]map[string]interface{}, len(opts.Fields))
	for i, f := range opts.Fields {
		rf := map[string]interface{}{
			"name": f.Name,
			"last": i == len(opts.Fields)-1,
		}
		if cfg.Language == "python" {
			rf["pyType"] = pyType[f.Type]
			rf["sqlType"] = sqlType[f.Type]
		} else {
			rf["tsType"] = tsType[f.Type]
			rf["zodType"] = zodType[f.Type]
			rf["drizzleField"] = drizzleColumn(f.Name, f.Type)
		}
		renderedFields[i] = rf
	}

	vars := map[string]interface{}{
		"entityName":       entityName,
		"entityNamePascal": entityNamePascal,
		"fields":           renderedFields,
		"protected":        opts.Auth == "protected",
	}

	var filesWritten []string
	for tpl, targetPattern := range cfg.Templates {
		tplPath := filepath.Join(scaffoldDir, tpl)
		if !fsutil.PathExists(tplPath) {
			continue
		}
		rawTpl, err := os.ReadFile(tplPath)
		if err != nil {
			return Result{}, err
		}
		rendered, err := raymond.Render(string(rawTpl), vars)
		if err != nil {
			return Result{}, fmt.Errorf("rendering %s: %w", tplPath, err)
		}
		relTarget := substitute(targetPattern, entityName, entityNamePascal)
		outPath := filepath.Join(opts.TargetDir, relTarget)
		if err := os.MkdirAll(filepath.Dir(outPath), 0755); err != nil {
			return Result{}, err
		}
		if err := os.WriteFile(outPath, []byte(rendered), 0644); err != nil {
			return Result{}, err
		}
		filesWritten = append(filesWritten, relTarget)
	}

	var wiringApplied, wiringSkipped []string
	for _, w := range cfg.Wiring {
		file := substitute(w.File, entityName, entityNamePascal)
		insert := substitute(w.Insert, entityName, entityNamePascal)
		if fsutil.InsertAtAnchorSafe(filepath.Join(opts.TargetDir, file), w.Anchor, insert) {
			wiringApplied = append(wiringApplied, file)
		} else {
			wiringSkipped = append(wiringSkipped, fmt.Sprintf("%s (feature that owns this anchor isn't installed — wire it manually)", file))
		}
	}

	return Result{FilesWritten: filesWritten, WiringApplied: wiringApplied, WiringSkipped: wiringSkipped}, nil
}
