# Aimin fork of Twenty

This is a modified version of [Twenty](https://github.com/twentyhq/twenty), offered under the AGPLv3
(section 13: source for the version AIMIN runs at crm.aimin.ai).

Branch `aimin/v2.45.6` = upstream tag `twenty/v2.45.6` + one change:

- `packages/twenty-server/src/engine/core-modules/auth/constants/max-workspaces-without-organization-key.constants.ts`:
  the workspace limit reads `MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY` from the environment (default 30, upstream 5).

Image: `ghcr.io/aimin-ai/twenty:v2.45.6-aimin.2`, built with
`docker build --target twenty -f packages/twenty-docker/twenty/Dockerfile .` (the `--target` is required).
