package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"

	"hackpack/internal/generate"
	"hackpack/internal/registry"
	"hackpack/internal/types"
)

func parseFieldsFlag(csv string) ([]generate.FieldSpec, error) {
	var out []generate.FieldSpec
	for _, entry := range strings.Split(csv, ",") {
		parts := strings.SplitN(entry, ":", 2)
		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid --fields entry %q. Expected name:type", entry)
		}
		name := strings.TrimSpace(parts[0])
		typ := strings.TrimSpace(parts[1])
		valid := false
		for _, vt := range generate.ValidFieldTypes {
			if string(vt) == typ {
				valid = true
				break
			}
		}
		if name == "" || !valid {
			return nil, fmt.Errorf("invalid --fields entry %q. Expected name:type, type one of string|number|boolean|date|relation", entry)
		}
		out = append(out, generate.FieldSpec{Name: name, Type: generate.FieldType(typ)})
	}
	return out, nil
}

func newPageCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "page",
		Short: "Page-related commands",
	}
	cmd.AddCommand(newPageAddCmd())
	return cmd
}

func newPageAddCmd() *cobra.Command {
	var fields, auth, registryFlag string

	cmd := &cobra.Command{
		Use:   "add [name]",
		Short: "Generate a CRUD page (route + API + DB schema) in the current project",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			targetDir, err := os.Getwd()
			if err != nil {
				return err
			}
			raw, err := os.ReadFile(filepath.Join(targetDir, "hackpack.json"))
			if err != nil {
				return fmt.Errorf("no hackpack.json here — run this inside a project created with `hackpack new`")
			}
			var manifest types.HackpackManifest
			if err := json.Unmarshal(raw, &manifest); err != nil {
				return err
			}

			registryPath, err := registry.ResolveRegistry(registryFlag)
			if err != nil {
				return err
			}

			if len(args) == 0 {
				return fmt.Errorf("entity name is required (positional arg): hackpack page add <name> --fields=...")
			}
			entityName := args[0]

			if fields == "" {
				return fmt.Errorf("at least one field is required (--fields=name:type,...)")
			}
			fieldSpecs, err := parseFieldsFlag(fields)
			if err != nil {
				return err
			}

			if auth == "" {
				auth = "public"
			}
			if auth != "protected" && auth != "public" {
				return fmt.Errorf("--auth must be \"protected\" or \"public\"")
			}

			result, err := generate.GeneratePage(generate.Options{
				RegistryPath: registryPath,
				TargetDir:    targetDir,
				Base:         manifest.Base,
				EntityName:   entityName,
				Fields:       fieldSpecs,
				Auth:         auth,
			})
			if err != nil {
				return err
			}

			fmt.Printf("Generated:\n  %s\n", joinLines(result.FilesWritten))
			if len(result.WiringApplied) > 0 {
				fmt.Printf("Wired into:\n  %s\n", joinLines(result.WiringApplied))
			}
			if len(result.WiringSkipped) > 0 {
				fmt.Printf("Skipped wiring (add manually):\n  %s\n", joinLines(result.WiringSkipped))
			}
			return nil
		},
	}

	cmd.Flags().StringVar(&fields, "fields", "", "Comma-separated name:type fields")
	cmd.Flags().StringVar(&auth, "auth", "", "protected | public")
	cmd.Flags().StringVar(&registryFlag, "registry", "", "Path to a template registry")

	return cmd
}
