# CONTRIBUTING.md

## 👋 Welcome

Thank you for considering contributing to **Charon**! This document outlines the workflow, coding standards, and release process for maintaining consistency and ensuring high-quality changes.

---

## Project Structure

This is a **macOS desktop application** built with the [Wails](https://wails.io/) framework. The project uses:

- **Go** for the backend
- **React + Vite (Node.js)** for the frontend
- A `Makefile` for building and bundling the app (including platform-specific `ffmpeg`)
- GitHub Actions for CI/CD and automatic releases

---

## How to Contribute

### Branching Strategy

We use a 3-branch model:

- `main`: Stable, production-ready code
- `devel`: Integration branch for testing feature branches
- `feat/<name>`: Feature or fix branches

### Steps to Contribute

1. **Fork the repo** and create a new branch from `devel`:
   ```bash
   git checkout -b feat/my-feature devel
   ```

2. **Implement your feature or fix**

3. **Test your changes locally**

4. **Push your branch and open a PR to `devel`**

5. After review and merge into `devel`, it will be tested and staged for release


This will also include the correct `ffmpeg` binary for your architecture.

---

## Release Process (Maintainers Only)

When the app is ready for release:

1. Checkout to `main` and merge `devel`:

   ```bash
   git checkout main
   git merge devel
   ```

2. Run the release bump script:

   ```bash
   ./bump.py patch  # or `minor`, `major`
   ```

   This will:
   - Bump the version in `VERSION`
   - Update the top of `CHANGELOG.md`
   - Open the changelog for editing
   - Commit and push the version + tag

3. After pushing, GitHub Actions will automatically:
   - Build the app for both `x86_64` and `arm64`
   - Attach zipped `.app` bundles
   - Create a GitHub Release using the latest tag and changelog

---

## Tests

*Currently, tests are manual. Please validate features locally before opening a PR.*

---

## 📄 License

Charon is licensed under [MIT](./LICENSE).
