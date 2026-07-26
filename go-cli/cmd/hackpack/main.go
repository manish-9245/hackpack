// Command hackpack is a Go port of the TS hackpack CLI (cli/), consuming the
// same data-only registry at templates/. See go-cli's top-level report for
// scope and known gaps (NLP --describe, remote git registries, interactive
// wizard — all intentionally not ported).
package main

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

func main() {
	root := &cobra.Command{
		Use:   "hackpack",
		Short: "Scaffold hackathon projects from a template registry",
	}
	root.AddCommand(
		newNewCmd(),
		newAddCmd(),
		newPageCmd(),
		newDeployCmd(),
		newRegistryCmd(),
		newUpdateCmd(),
	)
	if err := root.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, "Error:", err)
		os.Exit(1)
	}
}
