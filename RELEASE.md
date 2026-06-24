# 🚀 Release Process

How to release a new version of fox-ecom SDK

## 📋 Pre-Release Checklist

- [ ] All features implemented and merged to `main`
- [ ] All tests passing
- [ ] No security vulnerabilities (npm audit)
- [ ] CHANGELOG.md updated
- [ ] Package version updated in `package.json`
- [ ] Code reviewed and approved
- [ ] Branch up-to-date with origin/main

## 🔄 Release Steps

### 1️⃣ Prepare Release Branch (Optional but Recommended)

```bash
# Create release branch
git checkout -b release/v1.0.0

# Update version in package.json
npm version patch --no-git-tag-version
# or: major | minor | patch

# Verify version
cat package.json | grep version
```

### 2️⃣ Update Changelog

Create or update `CHANGELOG.md`:

```markdown
## [1.0.0] - 2026-06-24

### Added
- ✨ Feature 1
- ✨ Feature 2

### Fixed
- 🐛 Bug fix 1

### Changed
- 📝 Breaking change 1

### Security
- 🔒 Security fix 1
```

### 3️⃣ Commit & Push

```bash
# Stage changes
git add package.json CHANGELOG.md

# Commit
git commit -m "chore: prepare release v1.0.0"

# Push to release branch (if created)
git push origin release/v1.0.0

# Or push directly to main (if no release branch)
git push origin main
```

### 4️⃣ Create Pull Request (if release branch)

```bash
# Create PR via GitHub CLI
gh pr create \
  --title "chore: Release v1.0.0" \
  --body "Release version 1.0.0 with new features" \
  --base main \
  --head release/v1.0.0

# Or via Web UI:
# - Compare: main <- release/v1.0.0
# - Create PR
# - Review and merge
```

### 5️⃣ Merge to Main

```bash
# Via GitHub CLI
gh pr merge <PR_NUMBER> --squash

# Or via Web UI
# - Merge button
# - Use "Squash and merge"
```

### 6️⃣ Create GitHub Release

```bash
# Via GitHub CLI
gh release create v1.0.0 \
  --title "Fox eCommerce SDK v1.0.0" \
  --notes "Release notes here" \
  --generate-notes

# Or via Web UI:
# - Go to Releases
# - Click "Create a new release"
# - Tag: v1.0.0
# - Title: Fox eCommerce SDK v1.0.0
# - Description: Generated or custom notes
# - Click "Publish release"
```

**🚨 This triggers CI/CD!**
- ✅ Build runs
- ✅ Tests run
- ✅ Package publishes to npm

### 7️⃣ Verify Publication

```bash
# Wait ~2 minutes for npm to propagate

# Check npm registry
npm view fox-ecom

# Verify version
npm view fox-ecom version

# Test installation
npm install fox-ecom@latest --save-dev
npm ls fox-ecom
```

### 8️⃣ Announce Release

- [ ] Create GitHub announcement
- [ ] Update README with new version
- [ ] Post in project updates
- [ ] Send notification to users

---

## 📝 Version Numbering

**Semantic Versioning: MAJOR.MINOR.PATCH**

### PATCH (1.0.X)
- Bug fixes
- Performance improvements
- Documentation updates
- Internal refactoring

**Release**: `npm version patch`

### MINOR (1.X.0)
- New features
- Backward compatible
- New components/hooks

**Release**: `npm version minor`

### MAJOR (X.0.0)
- Breaking changes
- Major refactor
- Architecture changes
- API changes

**Release**: `npm version major`

---

## 🔄 Development Workflow

```
main (stable) ←-- release/v1.0.0 ←-- feature branches
                        ↓
                    CI/CD Runs
                        ↓
                   npm publish
```

### Feature Development:
```bash
# Create feature branch
git checkout -b feature/new-dialog

# Develop & test
# ... make changes ...

# Commit
git add .
git commit -m "feat(dialog): add custom dialog support"

# Push & create PR
git push origin feature/new-dialog
gh pr create
```

### Before Release:
1. All feature branches merged to `main`
2. All tests passing
3. Code reviewed
4. Security audit passed

---

## 🆘 Rollback Release

If release has issues:

```bash
# Delete release from GitHub (if within minutes)
gh release delete v1.0.0

# Unpublish from npm (within 24 hours)
npm unpublish fox-ecom@1.0.0

# Create hotfix branch
git checkout -b hotfix/v1.0.1

# Fix issue & test
# ... make changes ...

# Commit & push
git add .
git commit -m "fix: resolve issue in v1.0.0"
git push origin hotfix/v1.0.1

# Merge & release as patch version
npm version patch
git tag v1.0.1
gh release create v1.0.1 --generate-notes
```

---

## 📊 Release History

Current version: **0.1.0**

Track releases:
```bash
git tag -l
npm view fox-ecom versions
```

---

## ⚡ Quick Release (Experienced Users)

```bash
# Update version
npm version patch

# Push
git push --follow-tags

# Verify CI passes
# Create release on GitHub

# ✅ Done!
```

---

## 🔗 Resources

- [Semantic Versioning](https://semver.org/)
- [npm publish docs](https://docs.npmjs.com/cli/publish)
- [GitHub Releases](https://docs.github.com/en/repositories/releasing-projects-on-github)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Last Updated**: 2026-06-24
**Maintainer**: TuanVm37
