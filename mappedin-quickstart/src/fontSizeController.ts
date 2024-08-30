import { MapView, Space } from "@mappedin/mappedin-js";

const fontSizes = {
  normal: 12,
  medium: 16,
  large: 21,
};

let currentFontSize = fontSizes.normal;

export function applyFontSize(size: string, mapView: MapView, spaces: Space[]) {
  if (!mapView || !mapView.Labels) {
    console.error("mapView is not initialized or mapView.Labels undefined");
    return; //testing
  }

  const fontSize =
    fontSizes[size as keyof typeof fontSizes] || fontSizes.normal;

  currentFontSize = fontSize;

  mapView.Labels.removeAll();

  spaces.forEach((space) => {
    if (space.name) {
      mapView.Labels.add(space, space.name, {
        appearance: {
          text: { foregroundColor: "orange", size: fontSize },
        },
      });
    }
  });
}

export function fontSizesSwitcher(
  mapView: MapView,
  spaces: Space[],
) {
  const fontSizeSelector = document.getElementById(
    "font-size"
  ) as HTMLSelectElement;

  fontSizeSelector.addEventListener("change", (e) => {
    const selectedSize = (e.target as HTMLSelectElement).value;

    // initialise currently font size
    applyFontSize(selectedSize, mapView, spaces);

  });
  applyFontSize(fontSizeSelector.value,mapView,spaces);
}
export function getCurrentFontSize() {
  return currentFontSize;
}

(window as any).applyFontSize = applyFontSize;
(window as any).fontSizeSwitcher = fontSizesSwitcher;
(window as any).getCurrentFontSize = getCurrentFontSize;
