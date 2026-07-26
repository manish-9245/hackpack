package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"

	"hackpack/internal/compose"
	"hackpack/internal/registry"
	"hackpack/internal/types"
)

func newUpdateCmd() *cobra.Command {
	var registryFlag string

	cmd := &cobra.Command{
		Use:   "update [feature]",
		Short: "Re-fetch and re-apply an installed feature from its registry source (check `git diff` after)",
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

			var lock *types.HackpackLock
			if lockRaw, err := os.ReadFile(filepath.Join(targetDir, "hackpack.lock")); err == nil {
				var l types.HackpackLock
				if json.Unmarshal(lockRaw, &l) == nil {
					lock = &l
				}
			}

			var targets []string
			if len(args) == 1 {
				targets = []string{args[0]}
			} else {
				targets = manifest.Features
			}
			if len(targets) == 0 {
				fmt.Println("No features installed.")
				return nil
			}

			for _, feature := range targets {
				installed := false
				for _, f := range manifest.Features {
					if f == feature {
						installed = true
						break
					}
				}
				if !installed {
					return fmt.Errorf("%q isn't installed in this project. Installed: %s", feature, joinComma(manifest.Features))
				}

				source := registryFlag
				if source == "" && lock != nil {
					for _, f := range lock.Features {
						if f.Name == feature {
							source = f.Source
							break
						}
					}
				}
				registryPath, err := registry.ResolveRegistry(source)
				if err != nil {
					return err
				}
				label := source
				if label == "" {
					label = "bundled"
				}
				fmt.Printf("Updating %s from %s...\n", feature, label)
				if _, err := compose.ApplyFeature(registryPath, targetDir, manifest.Base, feature, map[string]interface{}{
					"projectName": filepath.Base(targetDir),
				}); err != nil {
					return err
				}
			}
			fmt.Println("Done. This overwrites files the feature owns — review `git diff` before committing.")
			return nil
		},
	}

	cmd.Flags().StringVar(&registryFlag, "registry", "", "Override the registry source recorded in hackpack.lock")
	return cmd
}
