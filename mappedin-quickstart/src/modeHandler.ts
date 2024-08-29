import { MapView } from "@mappedin/mappedin-js";

const modes: { [key: string]: string } = {
  light: "https://tiles-cdn.mappedin.com/styles/honeycrisp/style.json",
  dark: "https://tiles-cdn.mappedin.com/styles/midnightblue/style.json",
}; //testing mode feature

export function applyMode(mode: string, mapView: MapView) {
  if (!mapView || !mapView.Outdoor) {
    console.error("mapView is not initialized or mapView.Outdoor is undefined");
    return;
  }

  document.body.classList.remove("light-mode", "dark-mode");

  if (mode === "dark") {
    document.body.classList.add("dark-mode");
    mapView.Outdoor.setStyle(modes.dark);
  } else {
    document.body.classList.add("light-mode");
    mapView.Outdoor.setStyle(modes.light);
  }
}

//handle mode selection
export function modeSwitcher(mapView: MapView)
{
  const modeSelector = document.getElementById("mode") as HTMLSelectElement;

  modeSelector.addEventListener("change", (e) => {
    const selectedMode = (e.target as HTMLSelectElement).value;
    applyMode(selectedMode, mapView);
  });

  // initialise currently selected mode
  applyMode(modeSelector.value, mapView);
}

(window as any).applyMode = applyMode;
(window as any).modeSwitcher = modeSwitcher;
