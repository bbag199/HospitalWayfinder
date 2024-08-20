import { getMapData, 
  show3dMap, 
  MapView, 
  Space, 
  Path, 
  Coordinate, 
  Directions, 
  show3dMapGeojson, 
  Floor } 
  from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import i18n from "./i18n";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: "6666f9ba8de671000ba55c63",
  secret: "d15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80",
  mapId: "6637fd20269972f02bf839da",
};

async function init() {
  //set the language to English on initialization
  i18n.changeLanguage("en");
  const language = i18n.language || "en";
  i18n.changeLanguage(language);

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

  // Function to translate and label locations
  function translateAndLabelLocations() {
    mapView.Labels.removeAll();

    mapData.getByType("space").forEach((space) => {
      const originalName = space.name;
      const translatedName = i18n.t(originalName);

      mapView.Labels.add(space, translatedName, {
        appearance: {
          text: { foregroundColor: "orange" },
        },
      });
    });
  }

  // Initial labeling
  translateAndLabelLocations();

  // Handle language change
  document.getElementById("language")?.addEventListener("change", () => {
    i18n.changeLanguage(
      (document.getElementById("language") as HTMLSelectElement).value,
      translateAndLabelLocations
    );
  });

  floorSelector.value = mapView.currentFloor.id;

  floorSelector.addEventListener("change", (e) => {
    mapView.setFloor((e.target as HTMLSelectElement)?.value);
  });

  mapView.on("floor-change", (event) => {
    const id = event?.floor.id;
    if (!id) return;
    floorSelector.value = id;
    setCameraPosition(); // Update the camera position when the floor changes
  });

  let startSpace: Space;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let accessibilityEnabled = false;
  let selectingStart = true; // 

  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#BAE0F3",
    });
  });

  mapView.on("click", async (event) => {
    if (!event) return;
    if (!startSpace) {
      startSpace = event.spaces[0];
    } else if (!path && event.spaces[0]) {
      const directions = await mapView.getDirections(startSpace, event.spaces[0], { accessible: accessibilityEnabled });
      if (!directions) return;

      // Add the main path
      path = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
        color: "orange"
      });
    } else if (path) {
      mapView.Paths.remove(path);
      //startSpace = null;
      path = null;
    }
  });

  const setCameraPosition = () => {
    const entranceCoordinate = new Coordinate(-37.007839, 174.888214);

    // Set the camera position with final bearing, zoom level, and center coordinate
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



  // Add labels for each map
  mapData.getByType("space").forEach((space) => {
    if (space.name) {
      //get translated location name
      let translatedName = space.name;

      if (space.name === "Module 2a ") {
        translatedName = i18n.t("Module 2a ");
      }
      //use translated name to re-label
      mapView.Labels.add(space, translatedName, {
        appearance: {
          text: { foregroundColor: "orange" },
        },
      });
    }
  });

  //Add the Stack Map and testing:
  //1)Add the stack "enable button":
  const stackMapButton = document.createElement("button");
  // Add any classes, text, or other properties (these two code can be linked to the css file):
  stackMapButton.className = "reset-button mi-button";
  stackMapButton.textContent = "Enable Stack Map";

  // Append the button to the desired parent element:
  mappedinDiv.appendChild(stackMapButton);

  //Testing: no show floors:
  //Find the floor that need to do the Stack Map, at this case, we testing 
  const noShowFloor2: Floor[] = mapData.getByType("floor").filter((floor: Floor) => (floor.name !== "Level 1" && floor.name !== "Ground floor"));

  // The enable Button is used to enable and disable Stacked Maps.
  stackMapButton.onclick = () => {
    
    //debug here:
    console.log("Chekcing noShowFloor2", noShowFloor2);
    //show the stack map here and hide the no used floor:
    //at here noShowFloor2 is no need floor.
    // Check the current state of the button text to determine the action
    if (stackMapButton.textContent === "Enable Stack Map") {
      // Show the stack map and hide the unused floor
      mapView.expand({ excludeFloors: noShowFloor2 });
      stackMapButton.textContent = "Disable Stack Map";
    } else {
      // Collapse the stack map
      mapView.collapse();
      stackMapButton.textContent = "Enable Stack Map";
    }
    
    //mapView.Camera.animateTo({ zoomLevel: 100 }, { duration: 1000 });
    mapView.Camera.set({
      zoomLevel: 19, // set the zoom level, better in 17-22
      pitch: 78,    // the angle from the top-down (0: Top-down, 90: Eye-level)
      //bearing: 0    // set the angle, e.g. North or South facing
    })

  };

  //Emergency exit function:
  //get the exit object (already build a exit01 and exit02 object in the dashboard map):
  const exitSpace = mapData.getByType('object').find(object => object.name.includes("exit01"));
  const exitSpace2 = mapData.getByType('object').find(object => object.name.includes("exit02"));
   

  //add an emergency square button here: 
  const emergencyButton = document.createElement("button");
  emergencyButton.textContent = "Emergency Exit";
  emergencyButton.style.position = "absolute";
  emergencyButton.style.bottom = "15px";
  emergencyButton.style.right = "10px";
  emergencyButton.style.zIndex = "1000";
  emergencyButton.style.padding = "10px";
  emergencyButton.style.backgroundColor = "#FF0000";
  emergencyButton.style.color = "#FFFFFF";
  emergencyButton.style.border = "none";
  emergencyButton.style.borderRadius = "5px";
  emergencyButton.style.cursor = "pointer";

  // Append the button to the map container
  mappedinDiv.appendChild(emergencyButton);


  emergencyButton.addEventListener('click', function() {
    console.log("chekcing startSpace input:", startSpace);
    console.log("exit01 space information:", exitSpace);
    
    if (startSpace) {
      if (path) {
        mapView.Paths.remove(path);
      }
      const directions = mapView.getDirections(startSpace, exitSpace!);
      const directions2 = mapView.getDirections(startSpace, exitSpace2!);
      //check the distance here:
      console.log("checking direcitions: ", directions?.distance);
      console.log("checking direcitions2: ", directions2?.distance);

      //checking the shortest wayout here:
      let shortestWayout;

      if (directions && directions2) {
          shortestWayout = directions.distance <= directions2.distance ? directions : directions2;
      } else if (directions) {
          shortestWayout = directions;
      } else if (directions2) {
          shortestWayout = directions2;
      } else {
          throw new Error("Both directions are undefined");
      }

      //build the shortest wayout here:
      if (shortestWayout) {   
        path = mapView.Paths.add(shortestWayout.coordinates, {
          nearRadius: 0.5,
          farRadius: 0.5,
          color: "red",
          animateDrawing: true, 
          drawDuration: 500,
          animateArrowsOnPath: true,
          displayArrowsOnPath: true

        });
        // Draw the directions on the map.
        mapView.Navigation.draw(shortestWayout);
      }
    } else {
      console.error("Please select start space locations.");
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
  const endSearchBar = document.getElementById(
    "end-search"
  ) as HTMLInputElement;
  const startSearchBar = document.getElementById(
    "start-search"
  ) as HTMLInputElement;
  const endResultsContainer = document.getElementById(
    "end-results"
  ) as HTMLDivElement;
  const startResultsContainer = document.getElementById(
    "start-results"
  ) as HTMLDivElement;

  endSearchBar.addEventListener("input", function () {
    const query = endSearchBar.value.toLowerCase();
    if (query) {
      performSearch(query, "end");
      endResultsContainer.style.display = "block";
    } else {
      endResultsContainer.style.display = "none";
    }
  });

  startSearchBar.addEventListener("input", function () {
    const query = startSearchBar.value.toLowerCase();
    if (query) {
      performSearch(query, "start");
      startResultsContainer.style.display = "block";
    } else {
      startResultsContainer.style.display = "none";
    }
  });

  document.addEventListener("click", function (event) {
    if (!(event.target as HTMLElement).closest(".search-container")) {
      endResultsContainer.style.display = "none";
      startResultsContainer.style.display = "none";
    }
  });

  function performSearch(query: string, type: "start" | "end") {
    const spaces: Space[] = mapData.getByType("space");
    const results: Space[] = spaces.filter((space) =>
      space.name.toLowerCase().includes(query)
    );
    displayResults(results, type);
  }

  function displayResults(results: Space[], type: "start" | "end") {
    const resultsContainer =
      type === "end" ? endResultsContainer : startResultsContainer;
    resultsContainer.innerHTML = "";
    results.forEach((result: Space) => {
      const resultItem = document.createElement("div");
      resultItem.className = "search-result-item";
      resultItem.textContent = result.name;
      resultItem.style.padding = "5px";
      resultItem.style.cursor = "pointer";
      resultItem.addEventListener("mouseover", function () {
        mapView.updateState(result, {
          hoverColor: "hover", // Simulate hover by setting the state
        });
      });
      resultItem.addEventListener("mouseleave", function () {
        mapView.updateState(result, {
          hoverColor: "default", // Revert to default state
        });
      });
      resultItem.addEventListener("click", function () {
        if (type === "end") {
          endSpace = result;
          endSearchBar.value = result.name;
        } else {
          startSpace = result;
          startSearchBar.value = result.name;
        }
        resultsContainer.style.display = "none"; // Hide results when a space is selected
      });
      resultsContainer.appendChild(resultItem);
    });
  }

  // Get Directions Button
  const getDirectionsButton = document.getElementById(
    "get-directions"
  ) as HTMLButtonElement;
  getDirectionsButton.addEventListener("click", function () {
    if (startSpace && endSpace) {
      if (path) {
        mapView.Paths.remove(path);
      }
      const directions = mapView.getDirections(startSpace, endSpace);
      if (directions) {
        path = mapView.Paths.add(directions.coordinates, {
          nearRadius: 0.5,
          farRadius: 0.5,
          color: "orange",
        });
      }
    } else {
      console.error("Please select both start and end locations.");
    }
  });
}

init();
