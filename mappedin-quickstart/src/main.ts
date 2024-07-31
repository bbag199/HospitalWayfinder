import { getMapData, show3dMap, MapView, Space, Path, Coordinate, Directions } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import i18n from "./i18n";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  mapId: '6637fd20269972f02bf839da',
};

async function init() {
  //set the language to English on initialization
  i18n.changeLanguage("en");

  const language = i18n.language || "en";
  i18n.changeLanguage(language);
  const contactLink = document.getElementById("contact-link");
  if (contactLink) {
    contactLink.innerText = i18n.t("Contact");
  }

  const mapData = await getMapData(options);
  const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
  const floorSelector = document.createElement("select");

  // Add styles to the floor selector to position it
  floorSelector.style.position = "absolute";
  floorSelector.style.top = "10px"; // Adjust as needed
  floorSelector.style.right = "10px"; // Adjust as needed
  floorSelector.style.zIndex = "1000"; // Ensure it is above other elements

  mappedinDiv.appendChild(floorSelector);

  // Add each floor to the floor selector.
  mapData.getByType("floor").forEach((floor) => {
    const option = document.createElement("option");
    option.text = floor.name;
    option.value = floor.id;
    floorSelector.appendChild(option);
  });

  // Display the default map in the mappedin-map div.
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
    setCameraPosition(id); // Update the camera position when the floor changes
  });

  // Add interactive space and pathfinding functionality
  // let startSpace: Space | null = null;
  // let path: Path | null = null;

  let startSpace: Space;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let connectionPath: Path | null = null;
  let selectingStart = true; // 

  // Set each space to be interactive and its hover color to orange.
  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#BAE0F3",
    });
  });

  // Act on the click. If no start space is set, set the start space.
  // If a start space is set and no path is set, add the path.
  // If a path is set, remove the path and start space.
  mapView.on("click", async (event) => {
    if (!event) return;
    if (!startSpace) {
      startSpace = event.spaces[0];
    } else if (!path && event.spaces[0]) {
      const directions = mapView.getDirections(startSpace, event.spaces[0]);
      if (!directions) return;

      // Add the main path
      path = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
        color: "#3178C6", // Set path color to blue
      });

      // Check if we need to add the connection path
      const startFloorId = startSpace?.floor.id;
      const endFloorId = event.spaces[0]?.floor.id;

      if (
        (startFloorId === "m_984215ecc8edf2ba" &&
          endFloorId === "m_79ab96f2683f7824") ||
        (startFloorId === "m_79ab96f2683f7824" &&
          endFloorId === "m_984215ecc8edf2ba")
      ) {
        const startCoordinate = new Coordinate(-37.008212, 174.887679);
        const endCoordinate = new Coordinate(-37.008202, 174.88719);

        connectionPath = mapView.Paths.add([startCoordinate, endCoordinate], {
          nearRadius: 0.5,
          farRadius: 0.5,
          color: "#3178C6", // Set connection path color to red
        });
      }
    } else if (path) {
      mapView.Paths.remove(path);
      //startSpace = null;
      path = null;
    }
  });

  // Mapping of floor IDs to their corresponding bearings and coordinates
  const floorSettings: {
    [key: string]: { bearing: number; coordinate: Coordinate };
  } = {
    m_da4e469267051fe3: {
      bearing: 200,
      coordinate: new Coordinate(-37.0082, 174.887104),
    },
    m_69cd3f0a0aca0001: {
      bearing: 200,
      coordinate: new Coordinate(-37.0082, 174.887104),
    },
    m_79ab96f2683f7824: {
      bearing: 200,
      coordinate: new Coordinate(-37.0082, 174.887104),
    },
    m_984215ecc8edf2ba: {
      bearing: 178.5,
      coordinate: new Coordinate(-37.008164, 174.888221),
    },
    m_94568a67928ac615: {
      bearing: 178.5,
      coordinate: new Coordinate(-37.008164, 174.888221),
    },
  };

  // Set the camera position with final bearing, zoom level, and center coordinate
  const setCameraPosition = (floorId: string) => {
    const settings = floorSettings[floorId] || {
      bearing: 178.5,
      coordinate: new Coordinate(0, 0),
    };

    // Set the camera position with final bearing, zoom level, and center coordinate
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

  // Call the function to set the camera position
  //setCameraPosition();

  // Iterate through each point of interest and label it.
  // for (const poi of mapData.getByType('point-of-interest')) {
  // 	// Label the point of interest if it's on the map floor currently shown.
  // 	if (poi.floor.id === mapView.currentFloor.id) {
  // 		mapView.Labels.add(poi.coordinate, poi.name);
  // 	}
  // }

  // Add labels for each map
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

  // Filter POIs with same floor id
  for (const poi of allPOIs) {
    if (poi.floor.id == currentFloor) {
      mapView.Labels.add(poi.coordinate, poi.name);
    }
  }

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
           hoverColor: "hover", // Simulate hover by setting the state
         });
       });
       resultItem.addEventListener('mouseleave', function() {
         mapView.updateState(result, {
           hoverColor: "default", // Revert to default state
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
}

init();