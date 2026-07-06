const CALL_WINDOW_NAME = "mytheus-call";
const CALL_WINDOW_FEATURES = "width=1680,height=980,menubar=no,toolbar=no,location=no";

/** Opens the call in its own window; repeated calls focus the same one. */
export function openCallWindow(path: string) {
  const win = window.open(path, CALL_WINDOW_NAME, CALL_WINDOW_FEATURES);
  win?.focus();
}

/** Closes the call window; falls back to the app when it was opened as a plain tab. */
export function leaveCallWindow() {
  window.close();
  setTimeout(() => {
    window.location.href = "/home";
  }, 180);
}
