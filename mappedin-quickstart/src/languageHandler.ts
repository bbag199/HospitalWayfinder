import i18n from "./i18n";

export function applySettings() {
  const mode = (document.getElementById('mode') as HTMLSelectElement).value;
  const language = (document.getElementById('language') as HTMLSelectElement).value;

  // Apply mode (light/dark)
  if (mode === 'dark') {
    document.body.style.backgroundColor = '#333';
    document.body.style.color = '#fff';
  } else {
    document.body.style.backgroundColor = '#fff';
    document.body.style.color = '#000';
  }

  // Apply language setting
  i18n.changeLanguage(language, () => {
    const contactLink = document.getElementById('contact-link');
    if (contactLink) {
      contactLink.innerText = i18n.t('Contact');
    }
  });

  // Close modal after applying settings
  const modal = document.getElementById("settingsModal") as HTMLElement;
  modal.style.display = "none";
}

// Attach to window object to make it accessible in index.html
(window as any).applySettings = applySettings;
