export function applyMode(mode: string) {
  document.body.classList.remove("light-mode", "dark-mode");

  if (mode === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.add("light-mode");
  }
}

(window as any).applyMode = applyMode;
