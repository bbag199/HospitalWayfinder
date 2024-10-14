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

function updateUrlWithStartSpace(startSpaceId: string): void {
  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set("startSpace", startSpaceId);
  window.history.pushState({}, '', currentUrl.toString());
}
