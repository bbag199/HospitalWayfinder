import { Space, MapView } from "@mappedin/mappedin-js";

const predefinedStartSpaceId: string | null = null; 

let cachedSpaces: Space[] = [];
let mapView: MapView | null = null;

const navigationState = {
  startSpace: null as Space | null,
  endSpace: null as Space | null,
  isPathDrawn: false,
};

export function setCachedSpaces(spaces: Space[]): void {
  cachedSpaces = spaces;
}

export function setMapView(view: MapView): void {
  mapView = view;
}

// This function handles the QR code scan event by checking for a predefined start space ID.
// If a valid space is found in the cachedSpaces, it switches the map to the correct floor,
// sets the start space in the navigation state, updates the localStorage and URL,
// and highlights the space on the map. If any part of the process fails (e.g., the space ID
// isn't found or mapView is null), it logs an error.
export async function handleQRCodeScan(): Promise<void> {
  if (predefinedStartSpaceId) {
    const space = cachedSpaces.find(space => space.id === predefinedStartSpaceId);
    
    if (space && mapView) {
      // Switch to the correct floor before setting the start space
      await mapView.setFloor(space.floor.id);

      // After switching to the correct floor, set the start space and update UI
      navigationState.startSpace = space;
      localStorage.setItem("startSpaceId", predefinedStartSpaceId);

      updateSearchBarWithStartSpace(predefinedStartSpaceId);
      updateUrlWithStartSpace(predefinedStartSpaceId);

      // highlight the space on the map
      mapView.updateState(space, { color: "#d4b2df" });
      
      console.log("Start space set from QR code:", predefinedStartSpaceId);
    } else {
      console.error("Predefined space ID not found in cached spaces or mapView is null.");
    }
  } else {
    console.error("No predefined start space ID set.");
  }
}
// This function updates the start space input field in the search bar with the corresponding space name.
function updateSearchBarWithStartSpace(spaceId: string): void {
  const space = cachedSpaces.find(space => space.id === spaceId);
  if (space) {
    const startSearchInput = document.getElementById("start-search") as HTMLInputElement | null;
    if (startSearchInput) {
      startSearchInput.value = space.name || '';
    }
  } else {
    console.error("Space ID not found in cached spaces.");
  }
}
// This function updates the browser's URL to include the start space ID as a query parameter.
function updateUrlWithStartSpace(startSpaceId: string): void {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("startSpace", startSpaceId);
  window.history.pushState({}, '', currentUrl.toString());
}
