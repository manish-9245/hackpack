package main

import (
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"

	"hackpack/internal/compose"
	"hackpack/internal/registry"
)

func newNewCmd() *cobra.Command {
	var base, features, pages, registryFlag string
	var yes bool
	var install bool

	cmd := &cobra.Command{
		Use:   "new [name]",
		Short: "Scaffold a new hackathon project",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			_ = yes // non-interactive is the only mode this Go build supports (see report); flag accepted for CLI-surface parity with the TS CLI.

			registryPath, err := registry.ResolveRegistry(registryFlag)
			if err != nil {
				return err
			}
			registryLabel := "bundled"
			if registryFlag != "" {
				registryLabel = registryFlag
			}

			if len(args) == 0 {
				return fmt.Errorf("project name is required (pass it positionally): hackpack new <name> --base=... --yes")
			}
			projectName := args[0]

			cwd, err := os.Getwd()
			if err != nil {
				return err
			}
			targetDir := filepath.Join(cwd, projectName)
			if info, err := os.Stat(targetDir); err == nil && info.IsDir() {
				entries, _ := os.ReadDir(targetDir)
				if len(entries) > 0 {
					return fmt.Errorf("directory %q already exists and isn't empty", projectName)
				}
			}

			bases, err := registry.ListTemplates(registryPath, "base")
			if err != nil {
				return err
			}
			if base == "" {
				return fmt.Errorf("--base is required (non-interactive mode)")
			}
			found := false
			names := make([]string, len(bases))
			for i, b := range bases {
				names[i] = b.Name
				if b.Name == base {
					found = true
				}
			}
			if !found {
				return fmt.Errorf("unknown base %q. Available: %s", base, joinComma(names))
			}

			result, err := compose.Compose(compose.Options{
				RegistryPath:  registryPath,
				RegistryLabel: registryLabel,
				TargetDir:     targetDir,
				ProjectName:   projectName,
				Base:          base,
				Features:      splitCsv(features),
				Pages:         splitCsv(pages),
			})
			if err != nil {
				return err
			}
			fmt.Println("Project composed")

			if install {
				if err := runNpmInstall(targetDir); err != nil {
					return err
				}
				fmt.Println("Dependencies installed")
				if err := runPostInstall(targetDir, result.PostInstall); err != nil {
					return err
				}
			}

			steps := []string{fmt.Sprintf("cd %s", projectName)}
			if !install {
				steps = append(steps, "npm install")
			}
			steps = append(steps, "npm run dev", "npx hackpack deploy   # when ready to ship")
			fmt.Printf("Done. Next steps:\n  %s\n", joinLines(steps))
			return nil
		},
	}

	cmd.Flags().StringVar(&base, "base", "", "Base template name (e.g. ts-nextjs)")
	cmd.Flags().StringVar(&features, "features", "", "Comma-separated feature names")
	cmd.Flags().StringVar(&pages, "pages", "", "Comma-separated page names")
	cmd.Flags().StringVar(&registryFlag, "registry", "", "Path to a template registry (defaults to the bundled one)")
	cmd.Flags().BoolVar(&yes, "yes", false, "Skip prompts, accept defaults, run installs non-interactively")
	cmd.Flags().BoolVar(&install, "install", true, "Run npm install after scaffolding")

	return cmd
}

func joinComma(items []string) string {
	out := ""
	for i, s := range items {
		if i > 0 {
			out += ", "
		}
		out += s
	}
	return out
}

func joinLines(items []string) string {
	out := ""
	for i, s := range items {
		if i > 0 {
			out += "\n  "
		}
		out += s
	}
	return out
}
