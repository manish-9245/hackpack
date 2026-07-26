package main

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"regexp"

	"github.com/spf13/cobra"
)

const freeTierReminder = "Free tier: 100k requests/day, 10ms CPU time/request (the one that actually bites — " +
	"avoid synchronous image/JSON-heavy work), D1 5GB/5M reads/day, R2 10GB, KV 100k reads + 1k writes/day."

var workersDevRe = regexp.MustCompile(`https?://\S+\.workers\.dev\S*`)

func newDeployCmd() *cobra.Command {
	var dryRun bool

	cmd := &cobra.Command{
		Use:   "deploy",
		Short: "Build and deploy the current project to Cloudflare Workers",
		RunE: func(cmd *cobra.Command, args []string) error {
			fmt.Println(freeTierReminder)
			cwd, err := os.Getwd()
			if err != nil {
				return err
			}

			// Every base defines its own cf:deploy / cf:dry-run script — deploy stays
			// generic across languages by just delegating to whichever one the base shipped.
			script := "cf:deploy"
			if dryRun {
				script = "cf:dry-run"
				fmt.Println("Building and running a dry-run deploy")
			} else {
				fmt.Println("Building and deploying to Cloudflare Workers")
			}

			execCmd := exec.Command("npm", "run", script)
			execCmd.Dir = cwd
			var out bytes.Buffer
			execCmd.Stdout = &out
			execCmd.Stderr = os.Stderr
			runErr := execCmd.Run()
			fmt.Println(out.String())
			if runErr != nil {
				fmt.Println("Deploy failed")
				return runErr
			}
			fmt.Println("Done")
			if m := workersDevRe.FindString(out.String()); m != "" {
				fmt.Printf("Live at %s\n", m)
			}
			return nil
		},
	}

	cmd.Flags().BoolVar(&dryRun, "dry-run", false, "Build and dry-run the deploy instead of shipping")
	return cmd
}
