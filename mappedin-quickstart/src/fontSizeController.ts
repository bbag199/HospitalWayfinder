import { MapView, Space } from "@mappedin/mappedin-js";

const fontSizes = {
  normal: 12,
  medium: 16,
  large: 21,
};

let currentFontSize = fontSizes.normal;

export function applyFontSize(
  size: string,
  mapView: MapView,
  spaces: Space[],
  translateAndLabelLocations: () => void
) {
  if (!mapView || !mapView.Labels) {
    console.error("mapView is not initialized or mapView.Labels undefined");
    return; //testing
  }

  currentFontSize =
    fontSizes[size as keyof typeof fontSizes] || fontSizes.normal;

  translateAndLabelLocations();
}

export function fontSizesSwitcher(
  mapView: MapView,
  spaces: Space[],
  translateAndLabelLocations: () => void
) {
  const fontSizeSelector = document.getElementById(
    "font-size"
  ) as HTMLSelectElement;

  fontSizeSelector.addEventListener("change", (e) => {
    const selectedSize = (e.target as HTMLSelectElement).value;
    applyFontSize(selectedSize, mapView, spaces, translateAndLabelLocations);
  });

  // initialise currently font size
  applyFontSize(
    fontSizeSelector.value,
    mapView,
    spaces,
    translateAndLabelLocations
  );
}

export function getCurrentFontSize() {
  return currentFontSize;
}

(window as any).applyFontSize = applyFontSize;
(window as any).fontSizeSwitcher = fontSizesSwitcher;
(window as any).getCurrentFontSize = getCurrentFontSize;
