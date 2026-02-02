# Better Styled - Monorepo

## Project Structure

```
better-styled/
├── packages/
│   └── lib/              # Main library (published to npm as "better-styled")
├── apps/
│   └── docs/             # Documentation site (Mintlify)
├── .release-it.json      # Release configuration
├── .npmrc                # NPM auth token (gitignored)
└── package.json          # Root workspace config
```

## Tech Stack

- **Package Manager**: Bun
- **Build Tool**: Turbo
- **Linting/Formatting**: Biome
- **Release**: release-it + @release-it/conventional-changelog
- **Shell**: Fish

## Versioning

- Both `package.json` (root) and `packages/lib/package.json` must have the same version
- Git tags follow the format `v1.0.0-beta.X`
- NPM package: `better-styled`

## Release Commands

### Beta Release
```bash
bun run release:beta
```

### Stable Release
```bash
bun run release
```

### Dry Run (test without publishing)
```bash
bun run release:dry
```

## Release Flow

1. Runs lint (`cd packages/lib && bun run lint`)
2. Bumps version in both `package.json` files
3. Builds the library (`cd packages/lib && bun run build`)
4. Updates `CHANGELOG.md` (conventional commits format)
5. Commits changes (`chore: release vX.X.X`)
6. Creates git tag (`vX.X.X`)
7. Pushes to GitHub
8. Creates GitHub Release (web-based, no GITHUB_TOKEN)
9. Publishes to npm with appropriate tag (`beta` or `latest`)

## NPM Authentication

Uses automation token stored in environment variable `NPM_TOKEN`.

### Setup (already done)
1. Token created at https://www.npmjs.com/settings/brunowilliang/tokens
2. Type: Granular Access Token with "Bypass 2FA" enabled
3. `.npmrc` in project root references `${NPM_TOKEN}`
4. Token exported in `~/.config/fish/config.fish`:
   ```fish
   set -gx NPM_TOKEN "npm_xxx..."
   ```

### .npmrc (root, gitignored)
```
//registry.npmjs.org/:_authToken=${NPM_TOKEN}
```

## Conventional Commits

Use these prefixes for commits:

- `feat:` - New feature (appears in changelog under "Features")
- `fix:` - Bug fix (appears in changelog under "Bug Fixes")
- `perf:` - Performance improvement (appears in changelog under "Performance")
- `refactor:` - Code refactoring (appears in changelog under "Refactoring")
- `docs:` - Documentation changes (appears in changelog under "Documentation")
- `chore:` - Maintenance tasks (hidden from changelog)
- `style:` - Code style changes (hidden from changelog)
- `test:` - Test changes (hidden from changelog)

## Important Notes

1. **Before releasing**: Ensure working directory is clean (`git status`)
2. **Tags**: release-it uses git tags to determine version. If tags get messed up:
   ```bash
   # Delete all local tags
   git tag -l | xargs git tag -d

   # Delete remote tags
   git push origin --delete <tag-name>

   # Create base tag for current npm version
   git tag v1.0.0-beta.X
   ```

3. **Version sync**: If versions get out of sync, update both:
   - `/package.json` -> `version`
   - `/packages/lib/package.json` -> `version`

4. **GitHub Releases**: Created via web browser (no GITHUB_TOKEN configured). A browser window will open for authentication.

## Common Issues

### "Working dir must be clean"
Commit or stash your changes before releasing.

### "Tag already exists"
Delete the conflicting tag locally and remotely, then retry.

### "Version not changed"
The hook uses `--allow-same-version` to handle this.

### NPM OTP error
Ensure `NPM_TOKEN` is set and the token has "Bypass 2FA" enabled.

## Files Reference

### .release-it.json
- `git.requireBranch`: `master` - Only release from master
- `npm`: `false` - Handled via hooks instead
- `hooks.after:release`: Publishes to npm with correct tag

### packages/lib/.gitignore
- Contains `.npmrc` to prevent committing tokens

### Root .gitignore
- Contains `.npmrc` to prevent committing tokens
