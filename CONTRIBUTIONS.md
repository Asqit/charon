# Contributing

## Git Strategies

- **pull-requests** only for `main` and `devel` branches

- `main` branch
- `devel` branch -> `main` branch by pull-request with fast forward merge
- `feat/<name>`-> `devel` branch by pull-request with squash commit


## Update Version:

Use the `bump.py` to update version the app. It will update `VERSION`, add a new record to `CHANGELOG.md` and also creates a new git tag. Please manually add and update the new changelog with your latest additions.

> `python bump.py [major|minor|patch]`
