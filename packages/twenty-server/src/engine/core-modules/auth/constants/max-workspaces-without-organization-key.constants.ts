// AIMIN fork: limit configurable via env (default 30). Source: https://github.com/Aimin-ai/twenty
export const MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY =
  Number(process.env.MAX_WORKSPACES_WITHOUT_ENTERPRISE_KEY) || 30;
