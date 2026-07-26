package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
)

func splitCsv(value string) []string {
	if value == "" {
		return nil
	}
	var out []string
	for _, v := range strings.Split(value, ",") {
		v = strings.TrimSpace(v)
		if v != "" {
			out = append(out, v)
		}
	}
	return out
}

// runNpmInstall + runPostInstall mirror the execa("npm", ["install"], {cwd})
// and per-postInstall-command execa calls in new.ts/add.ts.
func runNpmInstall(dir string) error {
	fmt.Println("Installing dependencies...")
	cmd := exec.Command("npm", "install")
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func runPostInstall(dir string, commands []string) error {
	for _, c := range commands {
		parts := strings.Fields(c)
		if len(parts) == 0 {
			continue
		}
		fmt.Println(c)
		cmd := exec.Command(parts[0], parts[1:]...)
		cmd.Dir = dir
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("running %q: %w", c, err)
		}
	}
	return nil
}
