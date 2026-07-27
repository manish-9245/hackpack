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

// Same glyph-for-glyph mascot as the TS CLI's banner.ts (uncolored — Go CLI
// takes on no color dependency). Raw string literal: backslashes below are
// literal, not escapes.
const banner = `
      .
     (o)
      |
   ^       ^
  / '.___.' \
 |  o     o  |
 |     v     |
  \_________/
   .-------.
  /  o---o  \
 |  |▓▓▓▓▓|  |
  \  o---o  /
   '-------'

    HACKPACK — Scaffold full-stack hackathon projects in seconds.
`

func main() {
	if len(os.Args) <= 1 || os.Args[1] == "--help" || os.Args[1] == "-h" {
		fmt.Println(banner)
	}

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
