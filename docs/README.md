# hackpack Documentation

Complete guide to using and extending hackpack.

## Getting Started

**New to hackpack?** Start here:
- **[Quick Start](QUICKSTART.md)** — Get running in 5 minutes
- **[Landing Page](index.html)** — Overview, examples, live demo

## Using hackpack

- **[Features Reference](FEATURES.md)** — All 16 features explained, compatibility matrix
- **[Main README](../README.md)** — Full CLI reference, examples, deployment

## Advanced

- **[Architecture](ARCHITECTURE.md)** — How hackpack works internally, composition model, type mappings
- **[Registry Development](registry.md)** — Build custom registries, multi-registry support

## Contributing

- **[Contributing Guide](CONTRIBUTING.md)** — How to add bases, features, pages, or fix bugs
- **[GitHub](https://github.com)** — Source code, issues, discussions

---

## Quick Navigation

| I want to... | Go to |
|---|---|
| Create my first project | [Quick Start](QUICKSTART.md) |
| See all features | [Features Reference](FEATURES.md) |
| See all CLI commands | [Main README](../README.md) |
| Learn how it works | [Architecture](ARCHITECTURE.md) |
| Build a custom registry | [Registry Development](registry.md) |
| Add a feature / base | [Contributing](CONTRIBUTING.md) |
| See it in action | [Landing Page](index.html) |

---

## Documentation Structure

```
docs/
├── index.html              # Landing page (deploy to GitHub Pages)
├── README.md               # This file (documentation index)
├── QUICKSTART.md           # 5-minute getting started
├── FEATURES.md             # All 16 features explained
├── ARCHITECTURE.md         # How hackpack works
├── CONTRIBUTING.md         # How to contribute
└── (other docs as needed)

../README.md                # Main project README
../CONTRIBUTING.md          # GitHub repo contributing (can link to docs/CONTRIBUTING.md)
```

---

## Deployment

### GitHub Pages

To deploy the landing page + docs to GitHub Pages:

1. Ensure `docs/index.html` exists (it does)
2. In GitHub repo settings:
   - Go to Settings > Pages
   - Select "Deploy from branch"
   - Set branch to `main` or `master`
   - Set folder to `/docs`
3. Push to GitHub
4. Visit `https://yourusername.github.io/hackpack`

### Custom Domain

If you have a custom domain (e.g., hackpack.dev):
1. Add a `CNAME` file to `/docs` with your domain:
   ```
   hackpack.dev
   ```
2. Configure DNS to point to GitHub Pages IP addresses
3. Enable HTTPS in GitHub repo settings

---

## Building This Site

The landing page (`index.html`) is a single self-contained HTML file with:
- Inline CSS (dark theme, responsive)
- Inline JavaScript (tab switching)
- No external dependencies
- Works offline
- Mobile-friendly

To edit:
1. Open `index.html` in a text editor
2. Modify content/CSS/JS
3. Commit and push
4. GitHub Pages auto-deploys

---

## Feedback & Issues

- **Bug reports** → [GitHub Issues](https://github.com/issues)
- **Feature ideas** → [GitHub Discussions](https://github.com/discussions)
- **Doc improvements** → Send a PR or open an issue

---

Last updated: 2026-07-26
