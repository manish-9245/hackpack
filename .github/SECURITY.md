# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in hackpack, please email **security@hackpack.dev** with:

1. **Description** — What is the vulnerability?
2. **Affected versions** — Which versions of hackpack are impacted?
3. **Steps to reproduce** — How can we confirm the issue?
4. **Proposed fix** (optional) — Do you have a fix?

We will acknowledge your report within 48 hours and work with you to resolve it responsibly.

## Security Best Practices

When using hackpack:

- ✅ **Keep dependencies up to date** — Run `npm update` regularly
- ✅ **Use environment variables** for secrets (API keys, DB passwords)
- ✅ **Validate user input** in your custom pages and API routes
- ✅ **Enable authentication** on protected routes (`--auth=protected`)
- ✅ **Review generated code** before deploying to production
- ✅ **Use HTTPS** for all deployments

## What We Audit

- Authentication and authorization flows
- Database schema and migrations
- Environment variable handling
- Dependency vulnerabilities (via Dependabot)
- CLI input validation

## What You're Responsible For

- Custom code you write in generated pages
- Third-party dependencies you add
- Secrets management (never commit `.env` files)
- Regular security updates to your project
