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

  const isSmallScreen = window.innerWidth <= 430;

  const directionsBtn = document.getElementById(
    "get-directions"
  ) as HTMLElement;
  if (directionsBtn) {
    directionsBtn.innerText = isSmallScreen ? "Go" : i18n.t("GetDirections");
  }

  const stopNavigationBtn = document.getElementById(
    "stop-navigation"
  ) as HTMLElement;
  if (stopNavigationBtn) {
    stopNavigationBtn.innerText = isSmallScreen
      ? "Stop"
      : i18n.t("StopNavigation");
  }

  // const emergencyBtn = document.querySelector(
  //   "button[data-emergency-btn]"
  // ) as HTMLButtonElement;
  // if (emergencyBtn) {
  //   emergencyBtn.innerText = i18n.t("EmergencyExit");
  // }

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

const toiletsIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 17 15">
        <path fill="currentColor"
          d="M3 1.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 0 0-3 0M11.5 0a1.5 1.5 0 1 1 0 3a1.5 1.5 0 0 1 0-3M3.29 4a1 1 0 0 0-.868.504L.566 7.752a.5.5 0 1 0 .868.496l1.412-2.472A345.048 345.048 0 0 0 1 11h2v2.5a.5.5 0 0 0 1 0V11h1v2.5a.5.5 0 0 0 1 0V11h2L6.103 5.687l1.463 2.561a.5.5 0 1 0 .868-.496L6.578 4.504A1 1 0 0 0 5.71 4zM9 4.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v4a.5.5 0 0 1-1 0v-4h-1v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1-1 0z" />
      </svg>`;

const coffeeMugIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
    <path d="M6 22C5.44772 22 5 21.5523 5 21V19H19V21C19 21.5523 18.5523 22 18 22H6Z" fill="#8B4513"/>
    <path d="M19 3H7C5.34315 3 4 4.34315 4 6V17H20V6C20 4.34315 18.6569 3 17 3H19Z" fill="#D3D3D3"/>
    <path d="M6 17C6 18.1046 6.89543 19 8 19H16C17.1046 19 18 18.1046 18 17H6Z" fill="#A0522D"/>
    <path d="M7 4C6.44772 4 6 4.44772 6 5V6H18V5C18 4.44772 17.5523 4 17 4H7Z" fill="#A0522D"/>
</svg>`;

const mainEntranceArrowIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V6M12 6L7 11M12 6L17 11" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" />
    <circle cx="12" cy="6" r="2" fill="#4CAF50"/>
</svg>`;

// Function to translate and label locations
function translateAndLabelLocations(mapView: MapView, spaces: Space[]) {
  // Remove existing labels first (but not icons)
  mapView.Labels.removeAll();

  spaces.forEach((space) => {
    const translatedName = i18n.t(space.name); // Assuming you use i18n for translation

    // Re-add labels for all spaces, with translation applied
    mapView.Labels.add(space, translatedName, {
      rank: "always-visible",
      appearance: {
        text: {
          foregroundColor: "#063970", // Text color for the labels
        },
      },
    });

    // Add custom icons for specific spaces
    if (space.name && space.name.toLowerCase().includes("toilets")) {
      mapView.Labels.add(space, translatedName, {
        rank: "always-visible",
        appearance: {
          marker: {
            foregroundColor: {
              active: "white",
              inactive: "white",
            },
            icon: toiletsIcon, // Use your toilet icon
          },
          text: {
            foregroundColor: "#063970",
          },
        },
      });
    }

    if (space.name && space.name.toLowerCase() === "cafe") {
      mapView.Labels.add(space, translatedName, {
        rank: "always-visible",
        appearance: {
          marker: {
            foregroundColor: {
              active: "white",
              inactive: "white",
            },
            icon: coffeeMugIcon, // Use your cafe icon
          },
          text: {
            foregroundColor: "#063970",
          },
        },
      });
    }

    if (space.name && space.name.toLowerCase().includes("entrance")) {
      mapView.Labels.add(space, translatedName, {
        rank: "always-visible",
        appearance: {
          marker: {
            foregroundColor: {
              active: "white",
              inactive: "white",
            },
            icon: mainEntranceArrowIcon, // Use your entrance icon
          },
          text: {
            foregroundColor: "#063970",
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
