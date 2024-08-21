import QRCode from 'qrcode';
import { getMapData, show3dMap, MapView, Space, Path, Coordinate } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";

// Map options
const options = {
  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  mapId: '66b179460dad9e000b5ee951',
  locationId: 's_3cac89436c55b009',
};

async function init() {
  try {
    const mapData = await getMapData(options);
    const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
    const floorSelector = document.createElement("select");

    // Add styles to the floor selector to position it
    floorSelector.style.position = "absolute";
    floorSelector.style.top = "10px"; // Adjust as needed
    floorSelector.style.right = "10px"; // Adjust as needed
    floorSelector.style.zIndex = "1000"; // Ensure it is above other elements

    mappedinDiv.appendChild(floorSelector);

    // Add each floor to the floor selector
    mapData.getByType("floor").forEach((floor) => {
      const option = document.createElement("option");
      option.text = floor.name;
      option.value = floor.id;
      floorSelector.appendChild(option);
    });

    // Display the default map in the mappedin-map div
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
      if (id) {
        floorSelector.value = id;
        setCameraPosition(id); // Update the camera position when the floor changes
        addPOILabels(); // Re-add labels for the new floor
      }
    });

    let startSpace: Space;
    let endSpace: Space | null = null;
    let path: Path | null = null;

    // Set each space to be interactive and its hover color to orange
    mapData.getByType("space").forEach((space) => {
      mapView.updateState(space, {
        interactive: true,
        hoverColor: "#BAE0F3",
      });
    });

    // Click handler to set start space and path
    mapView.on("click", async (event) => {
      if (!event) return;

      if (!startSpace) {
        startSpace = event.spaces[0];
      } else if (!path && event.spaces[0]) {
        const directions = mapView.getDirections(startSpace, event.spaces[0]);
        if (directions) {
          mapView.Paths.removeAll();
          mapView.Markers.removeAll();

          path = mapView.Paths.add(directions.coordinates, {
            nearRadius: 0.5,
            farRadius: 0.5,
            color: "orange"
          });
        }
      } else if (path) {
        mapView.Paths.removeAll();
        mapView.Markers.removeAll();
        endSpace = null;
        path = null;
      }
    });

    // Mapping of floor IDs to their corresponding bearings and coordinates
    const floorSettings: { [key: string]: { bearing: number, coordinate: Coordinate } } = {
      'm_9f758af082f72a25': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },
      'm_649c1af3056991cb': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },
      'm_48ded7311ca820bd': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.888221) },
      'm_4574347856f74034': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.888221) },
    };

    // Set the camera position
    const setCameraPosition = (floorId: string) => {
      const settings = floorSettings[floorId] || { bearing: 178.5, coordinate: new Coordinate(0, 0) };
      mapView.Camera.animateTo(
        {
          bearing: settings.bearing,
          pitch: 0,
          zoomLevel: 18,
          center: settings.coordinate,
        },
        { duration: 2000 }
      );
    };

    setCameraPosition(mapView.currentFloor.id);

    function addPOILabels() {
      mapData.getByType('point-of-interest').forEach((poi) => {
          if (poi.floor.id === mapView.currentFloor.id) {
              mapView.Labels.add(poi.coordinate, poi.name);
          }
      });
  }

  // Call function to add labels initially
  addPOILabels();

  // Update labels when the floor changes
  mapView.on('floor-change', (event) => {
      const floorId = event?.floor.id;
      if (floorId) {
          addPOILabels(); // Re-add labels for the new floor
      }
  });

  mapData.getByType("space").forEach((space) => {
    if (space.name) {
      mapView.Labels.add(space, space.name, {
        appearance: {
          text: { foregroundColor: "black" }
        }
      });
    }
  });



    // Search bar functionality
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
            hoverColor: "hover"
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
          resultsContainer.style.display = 'none'; // Hide results when a space is selected
        });
        resultsContainer.appendChild(resultItem);
      });
    }

    // Get Directions Button
    const getDirectionsButton = document.getElementById('get-directions') as HTMLButtonElement;
    getDirectionsButton.addEventListener('click', function() {
      if (startSpace && endSpace) {
        if (path) {
          mapView.Paths.remove(path);
        }
        const directions = mapView.getDirections(startSpace, endSpace);
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

    // Ensure the QR image element is available in the DOM
    const qrImgEl = document.getElementById("qr") as HTMLImageElement;
    if (!qrImgEl) {
      console.error("QR code image element not found");
      return;
    }

    // QR Code URL
    const qrUrl = `https://app.mappedin.com/map/${options.mapId}`;
    generateQRCode(qrUrl, qrImgEl);

    function generateQRCode(url: string, qrImgEl: HTMLImageElement) {
      QRCode.toDataURL(url, { type: 'image/jpeg', margin: 1 }, (err, dataUrl) => {
        if (err) {
          console.error("Failed to generate QR code:", err);
        } else {
          qrImgEl.src = dataUrl;
        }
      });
    }
  } catch (error) {
    console.error("Initialization failed:", error);
  }
}

init();
