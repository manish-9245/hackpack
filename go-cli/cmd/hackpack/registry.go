package main

import (
	"fmt"

	"github.com/spf13/cobra"

	"hackpack/internal/config"
)

func newRegistryCmd() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "registry",
		Short: "Manage template registry sources",
	}

	add := &cobra.Command{
		Use:   "add <name> <source>",
		Short: "Save a named registry source for reuse (e.g. a team's own template repo)",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := config.AddRegistry(args[0], args[1]); err != nil {
				return err
			}
			fmt.Printf("Saved registry %q -> %s\n", args[0], args[1])
			fmt.Printf("Use it with: hackpack new --registry=%s\n", args[0])
			return nil
		},
	}

	remove := &cobra.Command{
		Use:   "remove <name>",
		Short: "Remove a saved registry",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) error {
			if err := config.RemoveRegistry(args[0]); err != nil {
				return err
			}
			fmt.Printf("Removed registry %q\n", args[0])
			return nil
		},
	}

	list := &cobra.Command{
		Use:   "list",
		Short: "List saved registries",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			cfg, err := config.Read()
			if err != nil {
				return err
			}
			if len(cfg.Registries) == 0 {
				fmt.Println("No saved registries. Add one with: hackpack registry add <name> <source>")
				return nil
			}
			for name, source := range cfg.Registries {
				fmt.Printf("%s  ->  %s\n", name, source)
			}
			return nil
		},
	}

	cmd.AddCommand(add, remove, list)
	return cmd
}
