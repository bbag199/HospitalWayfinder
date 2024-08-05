import { getMapData, show3dMap, MapView, Space, Path, Coordinate, Directions } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";

const options = {
  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  mapId: '6637fd20269972f02bf839da',
};

async function init() {
  const mapData = await getMapData(options);
  const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
  const floorSelector = document.createElement("select");

  floorSelector.style.position = "absolute";
  floorSelector.style.top = "10px";
  floorSelector.style.right = "10px";
  floorSelector.style.zIndex = "1000";

  mappedinDiv.appendChild(floorSelector);

  mapData.getByType("floor").forEach((floor) => {
    const option = document.createElement("option");
    option.text = floor.name;
    option.value = floor.id;
    floorSelector.appendChild(option);
  });

  const mapView: MapView = await show3dMap(
    document.getElementById("mappedin-map") as HTMLDivElement,
    mapData
  );

  floorSelector.value = mapView.currentFloor.id;

  floorSelector.addEventListener("change", (e) => {
    mapView.setFloor((e.target as HTMLSelectElement)?.value);
  });

  mapView.on("floor-change", (event) => {
    const id = event?.floor.id;
    if (!id) return;
    floorSelector.value = id;
  });

  let startSpace: Space;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let accessibilityEnabled = false;

  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#f26336",
    });
  });

  mapView.on("click", async (event) => {
    if (!event) return;
    if (!startSpace) {
      startSpace = event.spaces[0];
    } else if (!path && event.spaces[0]) {
      const directions = await mapView.getDirections(startSpace, event.spaces[0], { accessible: accessibilityEnabled });
      if (!directions) return;
      path = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
        color: "orange"
      });
    } else if (path) {
      mapView.Paths.remove(path);
      path = null;
    }
  });

  const setCameraPosition = () => {
    const entranceCoordinate = new Coordinate(-37.007839, 174.888214);

    mapView.Camera.animateTo(
      {
        bearing: 177.5,
        pitch: 80,
        zoomLevel: 300,
        center: entranceCoordinate,
      },
      { duration: 2000 }
    );
  };

  mapData.getByType("space").forEach((space) => {
    if (space.name) {
      mapView.Labels.add(space, space.name, {
        appearance: {
          text: { foregroundColor: "orange" }
        }
      });
    }
  });

  const allPOIs = mapData.getByType("point-of-interest");
  const currentFloor = mapView.currentFloor.id;

  for (const poi of allPOIs) {
    if (poi.floor.id == currentFloor) {
      mapView.Labels.add(poi.coordinate, poi.name);
    }
  }

  const endSearchBar = document.getElementById('end-search') as HTMLInputElement;
  const startSearchBar = document.getElementById('start-search') as HTMLInputElement;
  const endResultsContainer = document.getElementById('end-results') as HTMLDivElement;
  const startResultsContainer = document.getElementById('start-results') as HTMLDivElement;

  endSearchBar.addEventListener('input', function() {
    const query = endSearchBar.value.toLowerCase();
    if (query) {
      performSearch(query, 'end');
      endResultsContainer.style.display = 'block';
    } else {
      endResultsContainer.style.display = 'none';
    }
  });

  startSearchBar.addEventListener('input', function() {
    const query = startSearchBar.value.toLowerCase();
    if (query) {
      performSearch(query, 'start');
      startResultsContainer.style.display = 'block';
    } else {
      startResultsContainer.style.display = 'none';
    }
  });

  document.addEventListener('click', function(event) {
    if (!(event.target as HTMLElement).closest('.search-container')) {
      endResultsContainer.style.display = 'none';
      startResultsContainer.style.display = 'none';
    }
  });

  function performSearch(query: string, type: 'start' | 'end') {
    const spaces: Space[] = mapData.getByType("space");
    const results: Space[] = spaces.filter(space => space.name.toLowerCase().includes(query));
    displayResults(results, type);
  }

  function displayResults(results: Space[], type: 'start' | 'end') {
    const resultsContainer = type === 'end' ? endResultsContainer : startResultsContainer;
    resultsContainer.innerHTML = '';
    results.forEach((result: Space) => {
      const resultItem = document.createElement('div');
      resultItem.className = 'search-result-item';
      resultItem.textContent = result.name;
      resultItem.style.padding = '5px';
      resultItem.style.cursor = 'pointer';
      resultItem.addEventListener('mouseover', function() {
        mapView.updateState(result, {
          hoverColor: "hover",
        });
      });
      resultItem.addEventListener('mouseleave', function() {
        mapView.updateState(result, {
          hoverColor: "default",
        });
      });
      resultItem.addEventListener('click', function() {
        if (type === 'end') {
          endSpace = result;
          endSearchBar.value = result.name;
        } else {
          startSpace = result;
          startSearchBar.value = result.name;
        }
        resultsContainer.style.display = 'none';
      });
      resultsContainer.appendChild(resultItem);
    });
  }

  const getDirectionsButton = document.getElementById('get-directions') as HTMLButtonElement;
  getDirectionsButton.addEventListener('click', async function() {
    if (startSpace && endSpace) {
      if (path) {
        mapView.Paths.remove(path);
      }
      const directions = await mapView.getDirections(startSpace, endSpace, { accessible: accessibilityEnabled });
      if (directions) {
        path = mapView.Paths.add(directions.coordinates, {
          nearRadius: 0.5,
          farRadius: 0.5,
          color: "orange"
        });
      }
    } else {
      console.error("Please select both start and end locations.");
    }
  });


  // Button Accessibility
  const accessibilityButton = document.createElement("button");
accessibilityButton.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
    <path fill="currentColor" d="M192 96a48 48 0 1 0 0-96a48 48 0 1 0 0 96m-71.5 151.2c12.4-4.7 18.7-18.5 14-30.9s-18.5-18.7-30.9-14C43.1 225.1 0 283.5 0 352c0 88.4 71.6 160 160 160c61.2 0 114.3-34.3 141.2-84.7c6.2-11.7 1.8-26.2-9.9-32.5s-26.2-1.8-32.5 9.9C240 440 202.8 464 160 464c-61.9 0-112-50.1-112-112c0-47.9 30.1-88.8 72.5-104.8M259.8 176l-1.9-9.7c-4.5-22.3-24-38.3-46.8-38.3c-30.1 0-52.7 27.5-46.8 57l23.1 115.5c6 29.9 32.2 51.4 62.8 51.4h100.5c6.7 0 12.6 4.1 15 10.4l36.3 96.9c6 16.1 23.8 24.6 40.1 19.1l48-16c16.8-5.6 25.8-23.7 20.2-40.5s-23.7-25.8-40.5-20.2l-18.7 6.2l-25.5-68c-11.7-31.2-41.6-51.9-74.9-51.9h-68.5l-9.6-48H336c17.7 0 32-14.3 32-32s-14.3-32-32-32h-76.2z"/>
  </svg>
  Accessibility
`;
accessibilityButton.style.position = "absolute";
accessibilityButton.style.top = "50px";
accessibilityButton.style.right = "10px";
accessibilityButton.style.zIndex = "1000";
accessibilityButton.style.backgroundColor = "#0f2240";
accessibilityButton.style.color = "#ffffff";
accessibilityButton.style.border = "none";
accessibilityButton.style.padding = "10px";
accessibilityButton.style.cursor = "pointer";
accessibilityButton.style.borderRadius = "4px";

mappedinDiv.appendChild(accessibilityButton);

const originalColors: Map<string, string> = new Map();
let liftsHighlighted = false;
accessibilityEnabled = false;

accessibilityButton.addEventListener("click", () => {
  accessibilityEnabled = !accessibilityEnabled;
  const lifts = mapData.getByType("space").filter(space => space.name.toLowerCase().includes("lift"));

  lifts.forEach(lift => {
    if (!liftsHighlighted) {
      const originalColor = mapView.getState(lift)?.color;
      if (originalColor) {
        originalColors.set(lift.id, originalColor);
      }
      mapView.updateState(lift, {
        color: "#007bff"
      });
    } else {
      const originalColor = originalColors.get(lift.id);
      mapView.updateState(lift, {
        color: originalColor
      });
    }
  });

  liftsHighlighted = !liftsHighlighted;
  accessibilityButton.innerHTML = liftsHighlighted 
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M192 96a48 48 0 1 0 0-96a48 48 0 1 0 0 96m-71.5 151.2c12.4-4.7 18.7-18.5 14-30.9s-18.5-18.7-30.9-14C43.1 225.1 0 283.5 0 352c0 88.4 71.6 160 160 160c61.2 0 114.3-34.3 141.2-84.7c6.2-11.7 1.8-26.2-9.9-32.5s-26.2-1.8-32.5 9.9C240 440 202.8 464 160 464c-61.9 0-112-50.1-112-112c0-47.9 30.1-88.8 72.5-104.8M259.8 176l-1.9-9.7c-4.5-22.3-24-38.3-46.8-38.3c-30.1 0-52.7 27.5-46.8 57l23.1 115.5c6 29.9 32.2 51.4 62.8 51.4h100.5c6.7 0 12.6 4.1 15 10.4l36.3 96.9c6 16.1 23.8 24.6 40.1 19.1l48-16c16.8-5.6 25.8-23.7 20.2-40.5s-23.7-25.8-40.5-20.2l-18.7 6.2l-25.5-68c-11.7-31.2-41.6-51.9-74.9-51.9h-68.5l-9.6-48H336c17.7 0 32-14.3 32-32s-14.3-32-32-32h-76.2z"/></svg> Accessibility Disable`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M192 96a48 48 0 1 0 0-96a48 48 0 1 0 0 96m-71.5 151.2c12.4-4.7 18.7-18.5 14-30.9s-18.5-18.7-30.9-14C43.1 225.1 0 283.5 0 352c0 88.4 71.6 160 160 160c61.2 0 114.3-34.3 141.2-84.7c6.2-11.7 1.8-26.2-9.9-32.5s-26.2-1.8-32.5 9.9C240 440 202.8 464 160 464c-61.9 0-112-50.1-112-112c0-47.9 30.1-88.8 72.5-104.8M259.8 176l-1.9-9.7c-4.5-22.3-24-38.3-46.8-38.3c-30.1 0-52.7 27.5-46.8 57l23.1 115.5c6 29.9 32.2 51.4 62.8 51.4h100.5c6.7 0 12.6 4.1 15 10.4l36.3 96.9c6 16.1 23.8 24.6 40.1 19.1l48-16c16.8-5.6 25.8-23.7 20.2-40.5s-23.7-25.8-40.5-20.2l-18.7 6.2l-25.5-68c-11.7-31.2-41.6-51.9-74.9-51.9h-68.5l-9.6-48H336c17.7 0 32-14.3 32-32s-14.3-32-32-32h-76.2z"/></svg> Accessibility`;
});

}

init();
