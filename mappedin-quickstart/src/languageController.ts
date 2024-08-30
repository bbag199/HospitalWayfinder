import i18n from "./i18n";
import { applyMode } from "./modeController";
import { MapView } from "@mappedin/mappedin-js";

export function applySettings(mapView: MapView) {
  const mode = (document.getElementById("mode") as HTMLSelectElement).value;
  const language = (document.getElementById("language") as HTMLSelectElement)
    .value;

  // Apply mode (light/dark)
  if (mapView) {
    applyMode(mode, mapView);
  } else {
    console.error("mapView is not available in applySettings"); // for testing
  }

  // Apply language setting
  i18n.changeLanguage(language, () => {
    const contactLink = document.getElementById("contact-link");
    if (contactLink) {
      contactLink.innerText = i18n.t("Contact");
    }

    const homepageLink = document.getElementById("homepage-link");
    if (homepageLink) {
      homepageLink.innerText = i18n.t("Home");
    }

    const settingsBtn = document.getElementById("setting-btn");
    if (settingsBtn) {
      settingsBtn.innerText = i18n.t("Settings");
    }

    const receptionBtn = document.getElementById("reception-btn");
    if (receptionBtn) {
      receptionBtn.innerText = i18n.t("Reception");
    }

    const cafeBtn = document.getElementById("cafe-btn");
    if (cafeBtn) {
      cafeBtn.innerText = i18n.t("Cafe");
    }

    const toiletBtn = document.getElementById("toilet-btn");
    if (toiletBtn) {
      toiletBtn.innerText = i18n.t("Toilets");
    }

    const stackMapButton = document.querySelector(
      ".reset-button.mi-button"
    ) as HTMLButtonElement;
    if (stackMapButton) {
      stackMapButton.textContent = stackMapButton.textContent?.includes(
        i18n.t("EnableStackMap")
      )
        ? i18n.t("DisableStackMap")
        : i18n.t("EnableStackMap");
    }

    const modeLabel = document.querySelector(
      'label[for="mode"]'
    ) as HTMLElement;
    if (modeLabel) {
      modeLabel.innerText = i18n.t("Mode");
    }

    const languageLabel = document.querySelector(
      'label[for="language"]'
    ) as HTMLSelectElement;
    if (languageLabel) {
      languageLabel.innerText = i18n.t("Language");
    }

    const applyButton = document.getElementById("applySettings") as HTMLElement;
    if (applyButton) {
      applyButton.innerText = i18n.t("Apply");
    }

    const toField = document.getElementById("end-search") as HTMLInputElement;
    if (toField) {
      toField.placeholder = i18n.t("To");
    }

    const fromField = document.getElementById(
      "start-search"
    ) as HTMLInputElement;
    if (fromField) {
      fromField.placeholder = i18n.t("From");
    }

    const directionsBtn = document.getElementById(
      "get-directions"
    ) as HTMLElement;
    if (directionsBtn) {
      directionsBtn.innerText = i18n.t("GetDirections");
    }

    const emergencyBtn = document.querySelector(
      "button[data-emergency-btn]"
    ) as HTMLButtonElement;
    if (emergencyBtn) {
      emergencyBtn.innerText = i18n.t("EmergencyExit");
    }

    const modeSelect = document.getElementById("mode") as HTMLSelectElement;

    if (modeSelect) {
      const lightOption = modeSelect.querySelector(
        'option[value="light"]'
      ) as HTMLOptionElement;
      if (lightOption) {
        lightOption.innerText = i18n.t("Light");
      }

      const darkOption = modeSelect.querySelector(
        'option[value="dark"]'
      ) as HTMLOptionElement;
      if (darkOption) {
        darkOption.innerText = i18n.t("Dark");
      }

      const settingsTitle = document.getElementById(
        "settings-title"
      ) as HTMLElement;
      if (settingsTitle) {
        settingsTitle.innerText = i18n.t("SettingsTitle");
      }
    }
  });

  // Close modal after applying settings
  const modal = document.getElementById("settingsModal") as HTMLElement;
  modal.style.display = "none";
}

// Attach to window object to make it accessible in index.html
(window as any).applySettings = applySettings;
