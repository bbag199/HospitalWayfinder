import {
  getMapData,
  show3dMap,
  MapView,
  Space,
  MapData,
  Path,
  Coordinate,
  Floor,
} from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";
import i18n from "./i18n";
import { applySettings } from "./languageController";
import { modeSwitcher } from "./modeController";
import { fontSizesSwitcher } from "./fontSizeController";
import { languageSwitcher } from "./languageController";

// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: "6666f9ba8de671000ba55c63",
  secret: "d15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80",
  mapId: "66b179460dad9e000b5ee951",
};
//testing mode feature
let mapView: MapView;
let mapData: MapData;
let cachedSpaces: Space[];

async function init() {
  //set the language to English on initialization
  const language = i18n.language || "en";
  i18n.changeLanguage(language);

  mapData = await getMapData(options); //testing for font size
  cachedSpaces = mapData.getByType("space") as Space[]; // testing for font size

  const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
  const floorSelector = document.createElement("select");

  // Add styles to the floor selector to position it
  floorSelector.style.position = "absolute";
  floorSelector.style.top = "10px"; // Adjust as needed
  floorSelector.style.right = "10px"; // Adjust as needed
  floorSelector.style.zIndex = "1000"; // Ensure it is above other elements

  mappedinDiv.appendChild(floorSelector);

  // Display the default map in the mappedin-map div
  mapView = await show3dMap(
    document.getElementById("mappedin-map") as HTMLDivElement,
    mapData,
    {
      outdoorView: {
        style: "https://tiles-cdn.mappedin.com/styles/mappedin/style.json",
      },
    }
  );

  modeSwitcher(mapView);

  fontSizesSwitcher(mapView, cachedSpaces);
  languageSwitcher(mapView, cachedSpaces);

  // Initial labeling and translation
  applySettings(mapView, cachedSpaces);

  const applySettingsButton = document.getElementById("applySettings");
  if (applySettingsButton) {
    applySettingsButton.onclick = function () {
      applySettings(mapView, cachedSpaces);
    };
  } else {
    console.error("Apply Settings button not found in the document.");
  }

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

  // Add each floor to the floor selector
  mapData.getByType("floor").forEach((floor) => {
    const option = document.createElement("option");
    option.text = floor.name;
    option.value = floor.id;
    floorSelector.appendChild(option);
  });

  let startSpace: Space | null = null;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let accessibilityEnabled = false;

  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#BAE0F3",
    });
  });

  // Define a navigation state object
  let navigationState = {
    startSpace: null as Space | null,
    endSpace: null as Space | null,
    isPathDrawn: false,
  };

  mapView.on("click", async (event) => {
    if (!event) return;

    const clickedSpace = event.spaces[0];
    if (clickedSpace) {
      // Check if the state of the space can be retrieved and then store the original color

      const state = mapView.getState(clickedSpace);
      const originalColor = state ? state.color : "#FFFFFF";

      originalColors.set(clickedSpace.id, originalColor);

      mapView.updateState(clickedSpace, {
        color: "#d4b2df",
      });
    }

    // Check if it's the first click for the start space
    if (!navigationState.startSpace) {
      navigationState.startSpace = event.spaces[0];
    }
    // Check if it's the second click for the end space
    else if (
      !navigationState.endSpace &&
      event.spaces[0] !== navigationState.startSpace
    ) {
      navigationState.endSpace = event.spaces[0];

      // Check and draw path if both start and end are set
      if (navigationState.startSpace && navigationState.endSpace) {
        // Clear any previous paths if any
        if (navigationState.isPathDrawn) {
          mapView.Paths.removeAll();
          mapView.Markers.removeAll();
          setSpaceInteractivity(true); // Make spaces interactive again
          navigationState.isPathDrawn = false;
        }

        // Check if start and end spaces are on the same floor
        const sameFloor =
          navigationState.startSpace.floor === navigationState.endSpace.floor;

        // Force accessibility if on the same floor to avoid stairs
        const directionsOptions =
          accessibilityEnabled || sameFloor ? { accessible: true } : {};

        // Draw the path
        const directions = await mapView.getDirections(
          navigationState.startSpace,
          navigationState.endSpace,
          directionsOptions
        );

        if (directions) {
          mapView.Navigation.draw(directions, {
            pathOptions: {
              nearRadius: 0.5,
              farRadius: 0.5,
            },
          });
          navigationState.isPathDrawn = true; // Set flag indicating that a path is currently drawn
          setSpaceInteractivity(false); // Disable interactivity while path is drawn
        }
      }
    }
  });

  function setSpaceInteractivity(isInteractive: boolean): void {
    mapData.getByType("space").forEach((space) => {
      mapView.updateState(space, {
        interactive: isInteractive,
      });
    });
  }

  // Mapping of floor IDs to their corresponding bearings and coordinates
  const floorSettings: {
    [key: string]: { bearing: number; coordinate: Coordinate };
  } = {
    m_9f758af082f72a25: {
      bearing: 200,
      coordinate: new Coordinate(-37.0082, 174.887104),
    },
    m_649c1af3056991cb: {
      bearing: 200,
      coordinate: new Coordinate(-37.0082, 174.887104),
    },
    m_48ded7311ca820bd: {
      bearing: 178.5,
      coordinate: new Coordinate(-37.008164, 174.888221),
    },
    m_4574347856f74034: {
      bearing: 178.5,
      coordinate: new Coordinate(-37.008164, 174.888221),
    },
  };

  // Set the camera position
  const setCameraPosition = (floorId: string) => {
    const settings = floorSettings[floorId] || {
      bearing: 178.5,
      coordinate: new Coordinate(0, 0),
    };
    mapView.Camera.animateTo(
      {
        bearing: settings.bearing,
        pitch: 0,
        zoomLevel: 18,
        center: settings.coordinate,
      },
      { duration: 1000 }
    );
  };

  setCameraPosition(mapView.currentFloor.id);
  for (const poi of mapData.getByType("point-of-interest")) {
    // Label the point of interest if it's on the map floor currently shown.
    if (poi.floor.id === mapView.currentFloor.id) {
      mapView.Labels.add(poi.coordinate, poi.name);
    }
  }

  //Add the Stack Map and testing:
  //1)Add the stack "enable button":
  const stackMapButton = document.createElement("button");
  // Add any classes, text, or other properties (these two code can be linked to the css file):
  stackMapButton.className = "reset-button mi-button";
  stackMapButton.textContent = i18n.t("EnableStackMap");

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
    if (stackMapButton.textContent === i18n.t("EnableStackMap")) {
      // Show the stack map and hide the unused floor
      mapView.expand({ excludeFloors: noShowFloor2 });
      stackMapButton.textContent = i18n.t("DisableStackMap");

      // Set the camera to zoomLevel 17 and pitch 0
      mapView.Camera.animateTo({
        bearing: floorSettings[mapView.currentFloor.id].bearing, //178.5  // set the angle, e.g. North or South facing
        zoomLevel: 18.7, // set the zoom level, better in 17-22
        pitch: 85, // the angle from the top-down (0: Top-down, 90: Eye-level)
      });
    } else {
      // Collapse the stack map
      mapView.collapse();
      stackMapButton.textContent = i18n.t("EnableStackMap");
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
    .getByType("object")
    .find((object) => object.name.includes("exit03")); //this one should be the other building door
  const exitSpace4 = mapData
    .getByType("object")
    .find((object) => object.name.includes("exit04"));

  //add an emergency square button here:
  const emergencyButton = document.createElement("button");
  emergencyButton.className = "reset-button mi-button";
  emergencyButton.textContent = "Emergency Exit";
  //emergencyButton.style.position = "absolute";
  emergencyButton.style.bottom = "120px";
  //emergencyButton.style.right = "10px";
  emergencyButton.style.zIndex = "1000";
  emergencyButton.style.padding = "10px";
  emergencyButton.style.backgroundColor = "#FF0000"; //red bg color
  emergencyButton.style.color = "#FFFFFF"; //white font color
  //emergencyButton.style.border = "none";
  //emergencyButton.style.borderRadius = "5px";
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
      emergencyButton.style.backgroundColor = "#FF0000"; //red bg color
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
          shortestWayout =
            directions.distance <= directions2.distance
              ? directions
              : directions2;
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
          shortestWayout2 =
            shortestWayout.distance <= directions3.distance
              ? shortestWayout
              : directions3;
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
          shortestWayout3 =
            shortestWayout2.distance <= directions4.distance
              ? shortestWayout2
              : directions4;
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
      //startSpace = null;
    }
  });

  document.addEventListener("click", function (event) {
    if (!(event.target as HTMLElement).closest(".search-container")) {
      endResultsContainer.style.display = "none";
      startResultsContainer.style.display = "none";
    }
  });

  function performSearch(query: string, type: "start" | "end") {
    //const spaces: Space[] = mapData.getByType("space");//testing for font size
    const results: Space[] = cachedSpaces.filter((space) =>
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

        highlightSpace(result);
        resultsContainer.style.display = "none"; // Hide results when a space is selected
      });
      resultsContainer.appendChild(resultItem);
    });
  }

  function highlightSpace(space: Space) {
    // Store the original color
    const originalState = mapView.getState(space);
    const originalColor = originalState ? originalState.color : "#FFFFFF";

    // Store original color to revert back to it later if needed
    originalColors.set(space.id, originalColor);

    // Update the state of the space to highlight it
    mapView.updateState(space, {
      color: "#d4b2df", // Example highlight color
    });
  }
  // Stop Navigation Button
  const stopNavigationButton = document.getElementById(
    "stop-navigation"
  ) as HTMLButtonElement;

  stopNavigationButton.addEventListener("click", function () {
    // loops through all spaces in the map
    mapData.getByType("space").forEach((space) => {
      // retrieves the original color from the map
      const originalColor = originalColors.get(space.id);

      // checks if an original color exists, then reset to the original color
      if (originalColor) {
        mapView.updateState(space, {
          color: originalColor,
        });
      }
    });

    if (navigationState.isPathDrawn) {
      mapView.Paths.removeAll();
      mapView.Markers.removeAll();
      setSpaceInteractivity(true); // Make spaces interactive again if needed
      navigationState.isPathDrawn = false; // Reset the path drawn state
    }

    // Clears the search bar
    const startSearchBar = document.getElementById(
      "start-search"
    ) as HTMLInputElement;
    const endSearchBar = document.getElementById(
      "end-search"
    ) as HTMLInputElement;
    if (startSearchBar) startSearchBar.value = "";
    if (endSearchBar) endSearchBar.value = "";

    // Reset start and end spaces regardless of path state
    navigationState.startSpace = null;
    navigationState.endSpace = null;
    startSpace = null;
    endSpace = null;
  });
  // Get Directions Button
  const getDirectionsButton = document.getElementById(
    "get-directions"
  ) as HTMLButtonElement;

  getDirectionsButton.addEventListener("click", async function () {
    console.log("Start Space:", startSpace);
    console.log("End Space:", endSpace);
    if (startSpace && endSpace) {
      console.log("Both spaces are selected");
      if (navigationState.isPathDrawn) {
        mapView.Paths.removeAll();
        mapView.Markers.removeAll();
        navigationState.isPathDrawn = false;
        setSpaceInteractivity(true); // Reset interactivity
      }

      const areOnSameFloor = startSpace.floor === endSpace.floor;
      console.log("Are on same floor:", areOnSameFloor);

      try {
        const directions = await mapView.getDirections(startSpace, endSpace, {
          accessible: areOnSameFloor || accessibilityEnabled,
        });
        console.log("Directions:", directions);

        if (directions) {
          mapView.Navigation.draw(directions, {
            pathOptions: {
              nearRadius: 0.5,
              farRadius: 0.5,
            },
          });
          navigationState.isPathDrawn = true;
          setSpaceInteractivity(false); // Disable further interaction
        }
      } catch (error) {
        alert("Error fetching directions: " + error);
      }
    } else {
      alert("Please select both start and end locations.");
    }
  });

  // SearchingBar Dropdown list function:
  // Testing the search list container:
  // Will add four lists here: 1)Module (button) 2) Entrence (button) 3)Reception 4)Cafe
  // Function to show the dropdown
  const searchList = document.getElementById("search-list") as HTMLDivElement;
  const searchListEndPoint = document.getElementById(
    "search-list-endpoint"
  ) as HTMLDivElement;

  // Function to show the dropdown
  const showDropdown = (dropdown: HTMLDivElement) => {
    // Modified this function
    dropdown.style.display = "block";
  };

  // Function to hide the dropdown
  const hideDropdown = (dropdown: HTMLDivElement) => {
    // Modified this function
    dropdown.style.display = "none";
  };

  // Show the dropdown when the user clicks on the search bar
  startSearchBar.addEventListener("focus", () => {
    showDropdown(searchList);
    isModuleItemsVisible = false; // Reset the visibility flag when focusing on the search bar
    moduleItemsContainer.style.display = "none"; // Ensure Module item list is hidden
    isEntranceItemsVisible = false;
    entranceItemsContainer.style.display = "none";

    //setting for the reception and cafe:
    isReceptionDropdownItemsVisible = false; // Reset the visibility flag when focusing on the search bar
    receptionDropdownItemsContainer.style.display = "none"; // Ensure Module item list is hidden
  });
  endSearchBar.addEventListener("focus", () => {
    // Added this block**
    showDropdown(searchListEndPoint);
    isModuleItemsVisibleEndPoint = false;
    moduleItemsContainerEndPoint.style.display = "none";
    isEntranceItemsVisibleEndPoint = false;
    entranceItemsContainerEndPoint.style.display = "none";

    //setting for the reception and cafe:
    isReceptionDropdownItemsVisibleEndPoint = false; // Reset the visibility flag when focusing on the search bar
    receptionDropdownItemsContainerEndPoint.style.display = "none"; // Ensure Module item list is hidden
  });

  // Prevent immediate hiding of the dropdown on click
  startSearchBar.addEventListener("click", (event) => {
    event.stopPropagation();
    showDropdown(searchList);
  });
  endSearchBar.addEventListener("click", (event) => {
    // Added this block**
    event.stopPropagation();
    showDropdown(searchListEndPoint);
  });

  searchList.addEventListener("click", (event) => {
    event.stopPropagation();
  });
  searchListEndPoint.addEventListener("click", (event) => {
    // Added this block**
    event.stopPropagation();
  });

  // Hide the dropdown when clicking outside of it, after a short delay
  document.addEventListener("click", function (event: MouseEvent) {
    if (
      !searchList.contains(event.target as Node) &&
      event.target !== startSearchBar
    ) {
      setTimeout(() => {
        hideDropdown(searchList);
      }, 100); // Adjust delay as needed
    }

    if (
      !searchListEndPoint.contains(event.target as Node) &&
      event.target !== endSearchBar
    ) {
      // Added this block**
      setTimeout(() => {
        hideDropdown(searchListEndPoint);
      }, 100);
    }
  });

  //testing: the user click on the start input bar then end point drop down will hide,
  //same for the end point search bar:
  startSearchBar.addEventListener("click", () => {
    setTimeout(() => {
      hideDropdown(searchListEndPoint);
    }, 20);
  });

  endSearchBar.addEventListener("click", () => {
    setTimeout(() => {
      hideDropdown(searchList);
    }, 20);
  });

  //create function according to the input string to find the Space from database:
  function getSpaceByName(name: string): Space | undefined {
    // Retrieve the Space instance
    const spaceCollection: Space[] = mapData.getByType("space"); // get the space array from the mapData
    return spaceCollection.find((space) => space.name === name);
  }

  // Make the variable for the Module list button function:
  const moduleItemsContainer = document.getElementById(
    "module-items-container"
  ) as HTMLDivElement;
  const moduleButton = document.getElementById(
    "module-button"
  ) as HTMLButtonElement;

  const moduleItemsContainerEndPoint = document.getElementById(
    "module-items-container-endpoint"
  ) as HTMLDivElement; // Added this line
  const moduleButtonEndPoint = document.getElementById(
    "module-button-endpoint"
  ) as HTMLButtonElement; // Added this line

  // Function to populate module rooms
  const populateModuleRooms = (container: HTMLDivElement) => {
    const spaces: Space[] = mapData.getByType("space");
    container.innerHTML = ""; // Clear existing items

    spaces.forEach((space) => {
      if (space.name.includes("Module")) {
        const spaceOption = document.createElement("button");
        spaceOption.className = "button-13";
        spaceOption.textContent = space.name; // The property containing the space name
        container.appendChild(spaceOption);

        // Add click event listener to capture the button text
        spaceOption.addEventListener("click", () => {
          const selectedSpaceName = spaceOption.textContent;

          if (selectedSpaceName) {
            const spaceInstance: Space | undefined =
              getSpaceByName(selectedSpaceName); // Convert text to Space type

            if (spaceInstance) {
              // Update startSpace with the Space instance
              //startSpace = spaceInstance;
              //fill the starting point input bar
              //startSearchBar.value = spaceOption.textContent!;
              //console.log('startSpace updated:', startSpace);
              if (container === moduleItemsContainer) {
                // Update startSpace with the Space instance
                startSpace = spaceInstance;
                startSearchBar.value = spaceOption.textContent!;
                console.log("startSpace updated:", startSpace);
                highlightSpace(startSpace);
              } else if (container === moduleItemsContainerEndPoint) {
                // Update endSpace with the Space instance
                endSpace = spaceInstance;
                endSearchBar.value = spaceOption.textContent!;
                console.log("endSpace updated:", endSpace);
                highlightSpace(endSpace);
              }
            } else {
              console.error("Space not found for:", selectedSpaceName);
            }
          }
        });
      }
    });
  };

  // Make the variable for the Reception list button function:
  const receptionDropdownItemsContainer = document.getElementById(
    "reception-items-container"
  ) as HTMLDivElement;
  const receptionDropdownButton = document.getElementById(
    "reception-button"
  ) as HTMLButtonElement;

  const receptionDropdownItemsContainerEndPoint = document.getElementById(
    "reception-items-container-endpoint"
  ) as HTMLDivElement; // Added this line
  const receptionDropdownButtonEndPoint = document.getElementById(
    "reception-button-endpoint"
  ) as HTMLButtonElement; // Added this line

  // Function to populate module rooms
  const populateReceptionDropdownRooms = (container: HTMLDivElement) => {
    const spaces: Space[] = mapData.getByType("space");
    container.innerHTML = ""; // Clear existing items

    spaces.forEach((space) => {
      if (space.name.includes("Reception")) {
        const spaceOption = document.createElement("button");
        spaceOption.className = "button-13";
        spaceOption.textContent = space.name; // The property containing the space name
        container.appendChild(spaceOption);

        // Add click event listener to capture the button text
        spaceOption.addEventListener("click", () => {
          const selectedSpaceName = spaceOption.textContent;

          if (selectedSpaceName) {
            const spaceInstance: Space | undefined =
              getSpaceByName(selectedSpaceName); // Convert text to Space type

            if (spaceInstance) {
              if (container === receptionDropdownItemsContainer) {
                // Update startSpace with the Space instance
                startSpace = spaceInstance;
                startSearchBar.value = spaceOption.textContent!;
                console.log("startSpace updated:", startSpace);
              } else if (
                container === receptionDropdownItemsContainerEndPoint
              ) {
                // Update endSpace with the Space instance
                endSpace = spaceInstance;
                endSearchBar.value = spaceOption.textContent!;
                console.log("endSpace updated:", endSpace);
              }
            } else {
              console.error("Space not found for:", selectedSpaceName);
            }
          }
        });
      }
    });
  };

  // Flag to track the visibility of the module items container
  let isModuleItemsVisible = false;
  let isModuleItemsVisibleEndPoint = false;

  // Toggle module rooms visibility when the Module button is clicked
  moduleButton.addEventListener("click", () => {
    if (isModuleItemsVisible) {
      moduleItemsContainer.style.display = "none"; // Hide if already visible
    } else {
      populateModuleRooms(moduleItemsContainer); // Populate the module rooms
      moduleItemsContainer.style.display = "block"; // Show the module rooms
    }
    isModuleItemsVisible = !isModuleItemsVisible; // Toggle the flag
  });

  moduleButtonEndPoint.addEventListener("click", () => {
    // Added this block**

    if (isModuleItemsVisibleEndPoint) {
      moduleItemsContainerEndPoint.style.display = "none";
    } else {
      populateModuleRooms(moduleItemsContainerEndPoint); // Modified this line**
      moduleItemsContainerEndPoint.style.display = "block";
    }
    isModuleItemsVisibleEndPoint = !isModuleItemsVisibleEndPoint;
  });

  // Flag to track the visibility of the reception items container
  let isReceptionDropdownItemsVisible = false;
  let isReceptionDropdownItemsVisibleEndPoint = false;

  // Toggle module rooms visibility when the Module button is clicked
  receptionDropdownButton.addEventListener("click", () => {
    if (isReceptionDropdownItemsVisible) {
      receptionDropdownItemsContainer.style.display = "none"; // Hide if already visible
    } else {
      populateReceptionDropdownRooms(receptionDropdownItemsContainer); // Populate the module rooms
      receptionDropdownItemsContainer.style.display = "block"; // Show the module rooms
    }
    isReceptionDropdownItemsVisible = !isReceptionDropdownItemsVisible; // Toggle the flag
  });

  receptionDropdownButtonEndPoint.addEventListener("click", () => {
    // Added this block**
    if (isReceptionDropdownItemsVisibleEndPoint) {
      receptionDropdownItemsContainerEndPoint.style.display = "none";
    } else {
      populateReceptionDropdownRooms(receptionDropdownItemsContainerEndPoint); // Modified this line**
      receptionDropdownItemsContainerEndPoint.style.display = "block";
    }
    isReceptionDropdownItemsVisibleEndPoint =
      !isReceptionDropdownItemsVisibleEndPoint;
  });

  // Make the variable for the Entrance list button function:
  const entranceItemsContainer = document.getElementById(
    "entrance-items-container"
  ) as HTMLDivElement;
  const entranceButton = document.getElementById(
    "entrance-button"
  ) as HTMLButtonElement;

  const entranceItemsContainerEndPoint = document.getElementById(
    "entrance-items-container-endpoint"
  ) as HTMLDivElement; // Added this line
  const entranceButtonEndPoint = document.getElementById(
    "entrance-button-endpoint"
  ) as HTMLButtonElement; // Added this line

  // Function to populate module rooms
  const populateEntranceItem = (container: HTMLDivElement) => {
    const spaces: Space[] = mapData.getByType("space");
    container.innerHTML = ""; // Clear existing items

    spaces.forEach((space) => {
      if (space.name.includes("Entrance")) {
        const spaceOption = document.createElement("button");
        spaceOption.className = "button-13";
        spaceOption.textContent = space.name; // The property containing the space name
        container.appendChild(spaceOption);

        // Add click event listener to capture the button text
        spaceOption.addEventListener("click", () => {
          const selectedSpaceName = spaceOption.textContent;

          if (selectedSpaceName) {
            const spaceInstance: Space | undefined =
              getSpaceByName(selectedSpaceName); // Convert text to Space type

            if (spaceInstance) {
              // Update startSpace with the Space instance
              //startSpace = spaceInstance;
              //fill the starting point input bar
              //startSearchBar.value = spaceOption.textContent!;
              //console.log('startSpace updated:', startSpace);
              if (container === entranceItemsContainer) {
                // Update startSpace with the Space instance
                startSpace = spaceInstance;
                startSearchBar.value = spaceOption.textContent!;
                console.log("startSpace updated:", startSpace);
              } else if (container === entranceItemsContainerEndPoint) {
                // Update endSpace with the Space instance
                endSpace = spaceInstance;
                endSearchBar.value = spaceOption.textContent!;
                console.log("endSpace updated:", endSpace);
              }
            } else {
              console.error("Space not found for:", selectedSpaceName);
            }
          }
        });
      }
    });
  };

  // Flag to track the visibility of the module items container
  let isEntranceItemsVisible = false;
  let isEntranceItemsVisibleEndPoint = false; // Added this line**

  // Toggle module rooms visibility when the Module button is clicked
  entranceButton.addEventListener("click", () => {
    if (isEntranceItemsVisible) {
      entranceItemsContainer.style.display = "none"; // Hide if already visible
    } else {
      populateEntranceItem(entranceItemsContainer); // Populate the module rooms
      entranceItemsContainer.style.display = "block"; // Show the module rooms
    }
    isEntranceItemsVisible = !isEntranceItemsVisible; // Toggle the flag
  });

  entranceButtonEndPoint.addEventListener("click", () => {
    // Added this block**
    if (isEntranceItemsVisibleEndPoint) {
      entranceItemsContainerEndPoint.style.display = "none";
    } else {
      populateEntranceItem(entranceItemsContainerEndPoint); // Modified this line**
      entranceItemsContainerEndPoint.style.display = "block";
    }
    isEntranceItemsVisibleEndPoint = !isEntranceItemsVisibleEndPoint;
  });

  //making hte cafe dropdown button works:
  const cafeDropdownButton = document.getElementById(
    "cafe-button"
  ) as HTMLDivElement;
  const cafeDropdownButtonEndPoint = document.getElementById(
    "cafe-button-endpoint"
  ) as HTMLDivElement;

  cafeDropdownButton.addEventListener("click", () => {
    console.log("Cafe button at start point clicked.");
    const cafeSpace = mapData
      .getByType("space")
      .find((space) => space.name.includes("Cafe"));

    startSpace = cafeSpace!;
    startSearchBar.value = "Cafe";
    console.log("startSpace updated as Cafe:", startSpace);
  });

  cafeDropdownButtonEndPoint.addEventListener("click", () => {
    console.log("Cafe button at end point clicked.");
    const cafeSpace = mapData
      .getByType("space")
      .find((space) => space.name.includes("Cafe"));

    endSpace = cafeSpace!;
    endSearchBar.value = "Cafe";
    console.log("endSpace updated as Cafe:", endSpace);
  });

  //////////////////////////////////////////
  //searchingBar Dropdown list function above.

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
    const lifts = mapData
      .getByType("space")
      .filter(
        (space) =>
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
}

init();
