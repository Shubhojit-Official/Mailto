const KEY = "mailto_app_state";

export function loadAppState() {
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : { workspaces: {}, activeWorkspaceId: null };
}

export function saveAppState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
