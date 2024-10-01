import i18n from "./i18n";
import { applyMode } from "./modeController";
import { MapView, Space } from "@mappedin/mappedin-js";
import { getCurrentFontSize } from "./fontSizeController";

//Function to update the labels in the settings modal based on the selected language
export function updateSettingsLabels() {
  //web element translation
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
    const isEnabled = stackMapButton.textContent?.includes(
      i18n.t("DisableStackMap")
    );
    stackMapButton.textContent = isEnabled
      ? i18n.t("DisableStackMap")
      : i18n.t("EnableStackMap");
  }

  const modeLabel = document.querySelector('label[for="mode"]') as HTMLElement;
  if (modeLabel) {
    modeLabel.innerText = i18n.t("Mode");
  }

  const fontSizeLabel = document.querySelector(
    'label[for="font-size"]'
  ) as HTMLElement;
  if (fontSizeLabel) {
    fontSizeLabel.innerText = i18n.t("FontSize");
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

  const poiButton = document.getElementById("poi-btn") as HTMLElement;
  if (poiButton) {
    poiButton.innerText = i18n.t("Points of Interest");
  }

  const toField = document.getElementById("end-search") as HTMLInputElement;
  if (toField) {
    toField.placeholder = i18n.t("To");
  }

  const fromField = document.getElementById("start-search") as HTMLInputElement;
  if (fromField) {
    fromField.placeholder = i18n.t("From");
  }

  const directionsBtn = document.getElementById(
    "get-directions"
  ) as HTMLElement;
  if (directionsBtn) {
    directionsBtn.innerText = i18n.t("GetDirections");
  }

  const stopNavigationBtn = document.getElementById(
    "stop-navigation"
  ) as HTMLElement;
  if (stopNavigationBtn) {
    stopNavigationBtn.innerText = i18n.t("StopNavigation");
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
  }

  const fontSizeSelect = document.getElementById(
    "font-size"
  ) as HTMLSelectElement;

  if (fontSizeSelect) {
    const fontDefaultOption = fontSizeSelect.querySelector(
      'option[value="normal"]'
    ) as HTMLOptionElement;
    if (fontDefaultOption) {
      fontDefaultOption.innerText = i18n.t("Default");
    }

    const fontMediumOption = fontSizeSelect.querySelector(
      'option[value="medium"]'
    ) as HTMLOptionElement;
    if (fontMediumOption) {
      fontMediumOption.innerText = i18n.t("Medium");
    }

    const fontLargeOption = fontSizeSelect.querySelector(
      'option[value="large"]'
    ) as HTMLOptionElement;
    if (fontLargeOption) {
      fontLargeOption.innerText = i18n.t("Large");
    }
  }

  const settingsTitle = document.getElementById(
    "settings-title"
  ) as HTMLElement;
  if (settingsTitle) {
    settingsTitle.innerText = i18n.t("SettingsTitle");
  }
}

// Function to translate and label locations
function translateAndLabelLocations(mapView: MapView, spaces: Space[]) {
  mapView.Labels.removeAll();

  spaces.forEach((space) => {
    if (space.name) {
      const translatedName = i18n.t(space.name);
      mapView.Labels.add(space, translatedName, {
        appearance: {
          text: {
            foregroundColor: "#063970",
            size: getCurrentFontSize(),
          },
        },
      });
    }
  });
}

//handle language switching
export function languageSwitcher(mapView: MapView, spaces: Space[]) {
  const languageSelector = document.getElementById(
    "language"
  ) as HTMLSelectElement;

  languageSelector.addEventListener("change", (e) => {
    const selectedLanguage = (e.target as HTMLSelectElement).value;

    i18n.changeLanguage(selectedLanguage, () => {
      // labels translaton
      translateAndLabelLocations(mapView, spaces);
      // setting modal labels
      updateSettingsLabels();
    });
  });
}

export function applySettings(mapView: MapView, spaces: Space[]) {
  if (!mapView) {
    console.error("mapView is not available in applySettings");
    return; //testing
  }

  const mode = (document.getElementById("mode") as HTMLSelectElement).value;
  const language = (document.getElementById("language") as HTMLSelectElement)
    .value;

  applyMode(mode, mapView);

  // Apply language setting
  i18n.changeLanguage(language, () => {
    //map locations translation
    translateAndLabelLocations(mapView, spaces);

    //update settting modal labels
    updateSettingsLabels();
  });

  // Close modal after applying settings
  const modal = document.getElementById("settingsModal") as HTMLElement;
  modal.style.display = "none";
}

// Attach to window object to make it accessible in index.html
(window as any).applySettings = applySettings;
(window as any).languageSwitcher = languageSwitcher;
