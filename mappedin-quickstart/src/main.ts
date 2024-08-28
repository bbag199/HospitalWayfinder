import {
  getMapData,
  show3dMap,
  MapView,
  Space,
  Path,
  Coordinate,
  Directions,
  show3dMapGeojson,
  Floor,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import i18n from "./i18n";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: "6666f9ba8de671000ba55c63",
  secret: "d15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80",
  mapId: "66b179460dad9e000b5ee951",
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
    setCameraPosition(id); // Update the camera position when the floor changes
  });

  let startSpace: Space | null = null;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let accessibilityEnabled = false;
  let selectingStart = true; //
  let connectionPath: Path | null = null;

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
      // Determine if the start and end spaces are on the same floor
      const endSpace = event.spaces[0];
      const areOnSameFloor = startSpace.floor === endSpace.floor;
  
      // Set accessibility option based on whether the spaces are on the same floor
      const directions = await mapView.getDirections(
        startSpace,
        endSpace,
        { accessible: areOnSameFloor || accessibilityEnabled }
      );
  
      if (!directions) return;
  
      // Add the main path
      path = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
        color: "orange",
      });
    } else if (path) {
      // Remove the existing path and reset variables
      mapView.Paths.remove(path);
      path = null;
      startSpace = null;
    }
  });
  

  const floorSettings: { [key: string]: { bearing: number, coordinate: Coordinate } } = {
    'm_9f758af082f72a25': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },
    'm_649c1af3056991cb': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },
    'm_48ded7311ca820bd': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.887859) }, //Ground Floor ID
    'm_4574347856f74034': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.887859) }, //Level 1 ID
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
  for (const poi of mapData.getByType('point-of-interest')) {
      // Label the point of interest if it's on the map floor currently shown.
      if (poi.floor.id === mapView.currentFloor.id) {
          mapView.Labels.add(poi.coordinate, poi.name);
      }
  }

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
  //Find the floor that need to do the Stack Map, at this case, we testing the Ground floor and Level 1
  const noShowFloor2: Floor[] = mapData
    .getByType("floor")
    .filter(
      (floor: Floor) =>
        floor.name !== "SuperClinic Level 1" &&
        floor.name !== "SuperClinic & Surgical Centre Ground Lvl"
    );

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

      // Set the camera to zoomLevel 17 and pitch 0
      mapView.Camera.animateTo({
        bearing: floorSettings[mapView.currentFloor.id].bearing, //178.5  // set the angle, e.g. North or South facing
        zoomLevel: 18.7, // set the zoom level, better in 17-22
        pitch: 85,      // the angle from the top-down (0: Top-down, 90: Eye-level)   
      });

    } else {
      // Collapse the stack map
      mapView.collapse();
      stackMapButton.textContent = "Enable Stack Map";
      setCameraPosition(mapView.currentFloor.id);
      
    }
    
  };


  //Emergency exit function:
  //get the exit object (already build a exit01 and exit02 object in the dashboard map):
  const exitSpace = mapData
    .getByType("object")
    .find((object) => object.name.includes("exit01"));
  const exitSpace2 = mapData
    .getByType("object")
    .find((object) => object.name.includes("exit02"));
  const exitSpace3 = mapData
    .getByType('object')
    .find(object => object.name.includes("exit03"));  //this one should be the other building door 
  const exitSpace4 = mapData
    .getByType('object')
    .find(object => object.name.includes("exit04"));

  //add an emergency square button here:
  const emergencyButton = document.createElement("button");
  emergencyButton.textContent = "Emergency Exit";
  emergencyButton.style.position = "absolute";
  emergencyButton.style.bottom = "15px";
  emergencyButton.style.right = "10px";
  emergencyButton.style.zIndex = "1000";
  emergencyButton.style.padding = "10px";
  emergencyButton.style.backgroundColor = "#FF0000";   //red bg color
  emergencyButton.style.color = "#FFFFFF";  //white font color
  emergencyButton.style.border = "none";
  emergencyButton.style.borderRadius = "5px";
  emergencyButton.style.cursor = "pointer";
  emergencyButton.setAttribute("data-emergency-btn", "true");

  // Append the button to the map container
  mappedinDiv.appendChild(emergencyButton);

  let emergencyExitOn = false;

  emergencyButton.addEventListener("click", function () {
    if (emergencyExitOn) {
      // If the emergency exit is already on, turn it off
      if (path) {
          mapView.Paths.remove(path);
          path = null;
      }
      emergencyButton.textContent = "Emergency Exit";
      emergencyButton.style.backgroundColor = "#FF0000";   //red bg color
      emergencyExitOn = false;
  } else {
      console.log("chekcing startSpace input:", startSpace);
      console.log("exit01 space information:", exitSpace);

      if (startSpace) {
        if (path) {
          mapView.Paths.remove(path);
        }
        //create two distance for exit01 and exit02, will check the shortest way out later:
        const directions = mapView.getDirections(startSpace, exitSpace!);
        const directions2 = mapView.getDirections(startSpace, exitSpace2!);
        const directions3 = mapView.getDirections(startSpace, exitSpace3!);
        const directions4 = mapView.getDirections(startSpace, exitSpace4!);

        //debug the distance here:
        console.log("checking direcitions: ", directions?.distance);
        console.log("checking direcitions2: ", directions2?.distance);
        console.log("checking direcitions3: ", directions3?.distance);
        console.log("checking direcitions4: ", directions4?.distance);

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

        //checing the shortesWayout to the exit03 way:
        //checking the second shortest wayout with exit03 here:
        let shortestWayout2;
        if (shortestWayout && directions3) {
            shortestWayout2 = shortestWayout.distance <= directions3.distance ? shortestWayout : directions3;
        } else if (shortestWayout) {
            shortestWayout2 = shortestWayout;
        } else if (directions3) {
            shortestWayout2 = directions3;
        } else {
            throw new Error("exit way is undefined");
        }

        //checing the shortesWayout2 to the exit04 way:
        //checking the third shortest wayout with exit04 here:
        let shortestWayout3;
        if (shortestWayout2 && directions4) {
            shortestWayout3 = shortestWayout2.distance <= directions4.distance ? shortestWayout2 : directions4;
        } else if (shortestWayout2) {
            shortestWayout3 = shortestWayout2;
        } else if (directions4) {
            shortestWayout3 = directions4;
        } else {
            throw new Error("exit way is undefined");
        }

        //build the shortest wayout here:
        if (shortestWayout3) {   
          path = mapView.Paths.add(shortestWayout3.coordinates, {
            nearRadius: 0.5,
            farRadius: 0.5,
            color: "red",
          });
          emergencyButton.textContent = "Emergency Off";
          emergencyButton.style.backgroundColor = "#28a745";
          emergencyExitOn = true;
        }
      } else {
        // Show popup if startSpace is false
        alert("Please select starting point.");
        console.error("Please select start space locations.");
      }
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
      //try to testing the start point set as null by default when there is no query
      startSpace = null;
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
  
  getDirectionsButton.addEventListener("click", async function () {
    if (startSpace && endSpace) {
      if (path) {
        mapView.Paths.remove(path);
      }
  
      try {
        const sameFloor = startSpace.floor.id === endSpace.floor.id;
        const accessibleOption = sameFloor ? false : accessibilityEnabled;
        const directions = await mapView.getDirections(startSpace, endSpace, { accessible: accessibleOption });
  
        if (directions) {
          path = mapView.Paths.add(directions.coordinates, {
            nearRadius: 0.5,
            farRadius: 0.5,
            color: "orange",
          });
        } else {
          console.error("No directions found.");
        }
      } catch (error) {
        console.error("Error fetching directions:", error);
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
`;
  accessibilityButton.style.position = "absolute";
  accessibilityButton.style.top = "50px";
  accessibilityButton.style.right = "10px";
  accessibilityButton.style.zIndex = "1000";
  accessibilityButton.style.backgroundColor = "#fff";
  accessibilityButton.style.color = "#000";
  accessibilityButton.style.border = "none";
  accessibilityButton.style.padding = "10px";
  accessibilityButton.style.cursor = "pointer";
  accessibilityButton.style.borderRadius = "10px";

  mappedinDiv.appendChild(accessibilityButton);

  const originalColors: Map<string, string> = new Map();
  let liftsHighlighted = false;
  accessibilityEnabled = false;

accessibilityButton.addEventListener("click", () => {
  accessibilityEnabled = !accessibilityEnabled;
  const lifts = mapData.getByType("space").filter((space) => 
    space.name.toLowerCase().includes("elevator") || 
    space.name.toLowerCase().includes("lifts") 
  );

    lifts.forEach((lift) => {
      if (!liftsHighlighted) {
        const originalColor = mapView.getState(lift)?.color;
        if (originalColor) {
          originalColors.set(lift.id, originalColor);
        }
        mapView.updateState(lift, {
          color: "#7393B3",
        });
      } else {
        const originalColor = originalColors.get(lift.id);
        mapView.updateState(lift, {
          color: originalColor,
        });
      }
    });

    liftsHighlighted = !liftsHighlighted;
    if (liftsHighlighted) {
      accessibilityButton.style.backgroundColor = "#0f2240";
      accessibilityButton.style.color = "#fff";
    } else {
      accessibilityButton.style.backgroundColor = "#fff";
      accessibilityButton.style.color = "#000";
    }
  });

  // Icons
  const toiletButton = document.getElementById(
    "toilet-btn"
  ) as HTMLButtonElement;
  let toiletActive = false;

  toiletButton.addEventListener("click", () => {
    const toilets = mapData
      .getByType("space")
      .filter((space) => space.name.toLowerCase().includes("toilet"));

    toilets.forEach((toilets) => {
      if (!toiletActive) {
        const originalColor = mapView.getState(toilets)?.color;
        if (originalColor) {
          originalColors.set(toilets.id, originalColor);
        }
        mapView.updateState(toilets, {
          color: "#7393B3",
        });
      } else {
        const originalColor = originalColors.get(toilets.id);
        mapView.updateState(toilets, {
          color: originalColor,
        });
      }
    });

    toiletActive = !toiletActive;
    if (toiletActive) {
      toiletButton.style.backgroundColor = "#0f2240";
      toiletButton.style.color = "#fff";
    } else {
      toiletButton.style.backgroundColor = "#fff";
      toiletButton.style.color = "#000";
    }
  });

  const cafeButton = document.getElementById("cafe-btn") as HTMLButtonElement;
  let cafeActive = false;

  cafeButton.addEventListener("click", () => {
    const cafes = mapData
      .getByType("space")
      .filter((space) => space.name.toLowerCase().includes("cafe"));

    cafes.forEach((cafes) => {
      if (!cafeActive) {
        const originalColor = mapView.getState(cafes)?.color;
        if (originalColor) {
          originalColors.set(cafes.id, originalColor);
        }
        mapView.updateState(cafes, {
          color: "#7393B3",
        });
      } else {
        const originalColor = originalColors.get(cafes.id);
        mapView.updateState(cafes, {
          color: originalColor,
        });
      }
    });

    cafeActive = !cafeActive;
    if (cafeActive) {
      cafeButton.style.backgroundColor = "#0f2240";
      cafeButton.style.color = "#fff";
    } else {
      cafeButton.style.backgroundColor = "#fff";
      cafeButton.style.color = "#000";
    }
  });

  const receptionButton = document.getElementById(
    "reception-btn"
  ) as HTMLButtonElement;
  let receptionActive = false;

  receptionButton.addEventListener("click", () => {
    const receptionSpaces = mapData
      .getByType("space")
      .filter((space) => space.name.toLowerCase().includes("reception"));

    receptionSpaces.forEach((reception) => {
      if (!receptionActive) {
        const originalColor = mapView.getState(reception)?.color;
        if (originalColor) {
          originalColors.set(reception.id, originalColor);
        }
        mapView.updateState(reception, {
          color: "#7393B3",
        });
      } else {
        const originalColor = originalColors.get(reception.id);
        mapView.updateState(reception, {
          color: originalColor,
        });
      }
    });

    receptionActive = !receptionActive;
    if (receptionActive) {
      receptionButton.style.backgroundColor = "#0f2240";
      receptionButton.style.color = "#fff";
    } else {
      receptionButton.style.backgroundColor = "#fff";
      receptionButton.style.color = "#000";
    }
  });

  receptionActive = !receptionActive;
  if (receptionActive) {
    receptionButton.style.backgroundColor = "#0f2240";
    receptionButton.style.color = "#fff";
  } else {
    receptionButton.style.backgroundColor = "#fff";
    receptionButton.style.color = "#000";
  }
};





init();
