package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"

	"hackpack/internal/compose"
	"hackpack/internal/fsutil"
	"hackpack/internal/registry"
	"hackpack/internal/types"
)

func newAddCmd() *cobra.Command {
	var registryFlag string
	var install bool

	cmd := &cobra.Command{
		Use:   "add [feature]",
		Short: "Add a feature to the current project",
		Args:  cobra.MaximumNArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			targetDir, err := os.Getwd()
			if err != nil {
				return err
			}
			manifestPath := filepath.Join(targetDir, "hackpack.json")
			raw, err := os.ReadFile(manifestPath)
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
			registryLabel := "bundled"
			if registryFlag != "" {
				registryLabel = registryFlag
			}

			if len(args) == 0 {
				return fmt.Errorf("feature name is required (positional arg): hackpack add <feature>")
			}
			feature := args[0]

			for _, f := range manifest.Features {
				if f == feature {
					fmt.Printf("%q is already installed.\n", feature)
					return nil
				}
			}

			fmt.Printf("Adding %s\n", feature)
			result, err := compose.ApplyFeature(registryPath, targetDir, manifest.Base, feature, map[string]interface{}{
				"projectName": filepath.Base(targetDir),
			})
			if err != nil {
				return err
			}
			manifest.Features = append(manifest.Features, feature)
			if err := fsutil.WriteJSONFile(manifestPath, manifest); err != nil {
				return err
			}

			lockPath := filepath.Join(targetDir, "hackpack.lock")
			var lock types.HackpackLock
			if lockRaw, err := os.ReadFile(lockPath); err == nil {
				_ = json.Unmarshal(lockRaw, &lock)
			} else {
				lock = types.HackpackLock{
					Registry:   registryLabel,
					ResolvedAt: "",
					Base:       types.LockBase{Name: manifest.Base, Source: registryLabel},
					Features:   []types.LockRef{},
					Pages:      []types.LockPage{},
				}
			}
			lock.Features = append(lock.Features, types.LockRef{Name: feature, Source: registryLabel})
			if err := fsutil.WriteJSONFile(lockPath, lock); err != nil {
				return err
			}
			fmt.Printf("Added %s\n", feature)

			if install {
				if err := runNpmInstall(targetDir); err != nil {
					return err
				}
				fmt.Println("Dependencies installed")
				if err := runPostInstall(targetDir, result.PostInstall); err != nil {
					return err
				}
			}
			return nil
		},
	}

	cmd.Flags().StringVar(&registryFlag, "registry", "", "Path to a template registry")
	cmd.Flags().BoolVar(&install, "install", true, "Run npm install after adding")

	return cmd
}
