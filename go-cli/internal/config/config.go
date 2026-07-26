// Package config ports cli/src/config.ts: ~/.hackpack/config.json holds named
// registry sources. Both the TS and Go CLIs read/write this exact file so a
// registry saved by one is visible to the other.
package config

import (
	"encoding/json"
	"os"
	"path/filepath"

	"hackpack/internal/fsutil"
)

type Config struct {
	Registries map[string]string `json:"registries"`
}

func dir() (string, error) {
	home, err := os.UserHomeDir()
	if err != nil {
		return "", err
	}
	return filepath.Join(home, ".hackpack"), nil
}

func configPath() (string, error) {
	d, err := dir()
	if err != nil {
		return "", err
	}
	return filepath.Join(d, "config.json"), nil
}

// CacheDir mirrors CACHE_DIR from config.ts (~/.hackpack/cache). Only used by
// remote-git registry resolution, which this Go CLI does not implement (see
// registry.ResolveRegistry) — kept here for parity/documentation.
func CacheDir() (string, error) {
	d, err := dir()
	if err != nil {
		return "", err
	}
	return filepath.Join(d, "cache"), nil
}

func Read() (Config, error) {
	p, err := configPath()
	if err != nil {
		return Config{}, err
	}
	if !fsutil.PathExists(p) {
		return Config{Registries: map[string]string{}}, nil
	}
	raw, err := os.ReadFile(p)
	if err != nil {
		return Config{}, err
	}
	var cfg Config
	if err := json.Unmarshal(raw, &cfg); err != nil {
		return Config{}, err
	}
	if cfg.Registries == nil {
		cfg.Registries = map[string]string{}
	}
	return cfg, nil
}

func Write(cfg Config) error {
	d, err := dir()
	if err != nil {
		return err
	}
	if err := os.MkdirAll(d, 0755); err != nil {
		return err
	}
	p, err := configPath()
	if err != nil {
		return err
	}
	return fsutil.WriteJSONFile(p, cfg)
}

func AddRegistry(name, source string) error {
	cfg, err := Read()
	if err != nil {
		return err
	}
	cfg.Registries[name] = source
	return Write(cfg)
}

func RemoveRegistry(name string) error {
	cfg, err := Read()
	if err != nil {
		return err
	}
	delete(cfg.Registries, name)
	return Write(cfg)
}
