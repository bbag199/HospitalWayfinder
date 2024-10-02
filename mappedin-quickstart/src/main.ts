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
import QRCode from "qrcode";
import "@mappedin/mappedin-js/lib/index.css";
import i18n from "./i18n";
import { handleQRCodeScan, setCachedSpaces } from "./qrCodeHandler";
import { applySettings } from "./languageController";
import { modeSwitcher } from "./modeController";
import { fontSizesSwitcher } from "./fontSizeController";
import { languageSwitcher } from "./languageController";
import { updateButtonText } from "./buttonTextUpdater"; //update the Get Direction and Stop Nav button according to screen size
import { initializeButtonListeners } from "./poiButtonController";
import { RealTimeLocationTracker } from "./locationTracker";

import "./script";

const options = {
  key: import.meta.env.VITE_MAP_KEY,
  secret: import.meta.env.VITE_MAP_SECRET,
  mapId: import.meta.env.VITE_MAP_ID,
};

let mapView: MapView;
let mapData: MapData;
let cachedSpaces: Space[];
let locationTracker: RealTimeLocationTracker | null = null;

// Space ID for start space
const predefinedStartSpaceId = null; // Ensures no default start space is selected

async function init() {
  const language = i18n.language || "en";
  i18n.changeLanguage(language);

  mapData = await getMapData(options);
  cachedSpaces = mapData.getByType("space") as Space[];
  setCachedSpaces(cachedSpaces);

  // Log cached spaces to verify
  console.log("Cached spaces:", cachedSpaces);

  const mappedinDiv = document.getElementById("mappedin-map") as HTMLDivElement;
  const floorSelector = document.createElement("select");

  //makine other stylish floorSelector:
  //const floorSelectorNew = document.getElementById("floor-selector-new") as HTMLDivElement;
  //floorSelectorNew.value = mapView.currentFloor.id;

  // Add styles to the floor selector to position it
  floorSelector.id = "floor-selector2";
  //floorSelector.style.position = "absolute";
  //floorSelector.style.top = "10px"; // Adjust as needed
  //floorSelector.style.right = "10px"; // Adjust as needed
  //floorSelector.style.zIndex = "1000"; // Ensure it is above other elements

  mappedinDiv.appendChild(floorSelector);

  mapView = await show3dMap(
    document.getElementById("mappedin-map") as HTMLDivElement,
    mapData,
    {
      outdoorView: {
        style: "https://tiles-cdn.mappedin.com/styles/mappedin/style.json",
      },
    }
  );
  // Initialize mappedin maps and start tracking
  locationTracker = await RealTimeLocationTracker.getLocationTracker(mapView);

  modeSwitcher(mapView);
  fontSizesSwitcher(mapView, cachedSpaces);
  languageSwitcher(mapView, cachedSpaces);
  initializeButtonListeners();
  // Initial labeling and translation
  applySettings(mapView, cachedSpaces);
  handleQRCodeScan();

  // get toggle button element for real-time tracking
  const locationToggle = document.getElementById(
    "location-toggle"
  ) as HTMLButtonElement;

  locationTracker.toggleTrackingButton(locationToggle);

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
    setCameraPosition(id);
  });

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

  let navigationState = {
    isPathDrawn: false,
  };

  mapView.on("click", async (event) => {
    if (!event) return;

    const clickedSpace = event.spaces[0];
    if (clickedSpace) {
      const state = mapView.getState(clickedSpace);
      const originalColor = state ? state.color : "#FFFFFF";
      originalColors.set(clickedSpace.id, originalColor);

      mapView.updateState(clickedSpace, {
        color: "#d4b2df",
      });
    }

    const clickedSpaceName = clickedSpace ? clickedSpace.name : "";

    const startSearchInput = document.getElementById(
      "start-search"
    ) as HTMLInputElement | null;
    const endSearchInput = document.getElementById(
      "end-search"
    ) as HTMLInputElement | null;

    if (!startSpace) {
      startSpace = clickedSpace;
      localStorage.setItem("startSpaceId", clickedSpace.id);

      if (startSearchInput) {
        startSearchInput.value = clickedSpaceName;
      }

      updateUrlWithStartSpace(startSpace.id);
      console.log("Start space set:", startSpace.id);
    } else if (!endSpace && clickedSpace !== startSpace) {
      endSpace = clickedSpace;
      localStorage.setItem("endSpaceId", clickedSpace.id);

      if (endSearchInput) {
        endSearchInput.value = clickedSpaceName;
      }

      updateUrlWithSelectedSpaces(startSpace.id, endSpace.id);

      if (startSpace && endSpace) {
        if (navigationState.isPathDrawn) {
          mapView.Paths.removeAll();
          mapView.Markers.removeAll();
          setSpaceInteractivity(true);
          navigationState.isPathDrawn = false;
        }

        const sameFloor = startSpace.floor === endSpace.floor;

        const directionsOptions =
          accessibilityEnabled || sameFloor ? { accessible: true } : {};

        const directions = await mapView.getDirections(
          startSpace,
          endSpace,
          directionsOptions
        );

        if (directions) {
          mapView.Navigation.draw(directions, {
            pathOptions: {
              nearRadius: 0.5,
              farRadius: 0.5,
            },
          });
          navigationState.isPathDrawn = true;
          setSpaceInteractivity(false);
        }
      }
    }
  });

  function updateSearchBarWithStartSpace(spaceId: string): void {
    // Find the space from the cached spaces
    const space = cachedSpaces.find((space) => space.id === spaceId);

    if (space) {
      // Update the search bar with the name of the start space
      const startSearchInput = document.getElementById(
        "start-search"
      ) as HTMLInputElement | null;
      if (startSearchInput) {
        startSearchInput.value = space.name || "";
      }
    } else {
      console.error("Space ID not found in cached spaces.");
    }
  }
  function updateUrlWithStartSpace(startSpaceId: string): void {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("startSpace", startSpaceId);
    window.history.pushState({}, "", currentUrl.toString());
  }

  const qrImgEl = document.getElementById("qr") as HTMLImageElement;
  if (!qrImgEl) {
    console.error("QR code image element not found");
    return;
  }

  const qrUrl2 = predefinedStartSpaceId
    ? `https://hospital-wayfinder-d9fx.vercel.app/?startSpace=${predefinedStartSpaceId}`
    : `https://hospital-wayfinder-d9fx.vercel.app/`;

  generateQRCode(qrUrl2, qrImgEl);

  function generateQRCode(url: string, qrImgEl: HTMLImageElement) {
    QRCode.toDataURL(url, { type: "image/jpeg", margin: 1 }, (err, dataUrl) => {
      if (err) {
        console.error("Failed to generate QR code:", err);
      } else {
        qrImgEl.src = dataUrl;
      }
    });
  }

  document.getElementById("qr")?.addEventListener("click", () => {
    handleQRCodeScan();
  });

  // Function to update the URL with both start and end spaces
  function updateUrlWithSelectedSpaces(
    startSpaceId: string,
    endSpaceId: string
  ): void {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set("startSpace", startSpaceId);
    currentUrl.searchParams.set("endSpace", endSpaceId);
    window.history.pushState({}, "", currentUrl.toString()); // Update URL without reloading
  }
  document.getElementById("stop-navigation")?.addEventListener("click", () => {
    // Clear local storage
    localStorage.removeItem("startSpaceId");
    localStorage.removeItem("endSpaceId");

    // Verify removal
    console.log("Local storage items:", {
      startSpaceId: localStorage.getItem("startSpace"),
      endSpaceId: localStorage.getItem("endSpace"),
    });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.delete("startSpace");
    url.searchParams.delete("endSpace");
    window.history.replaceState({}, document.title, url.toString());

    // Reset the search bar
    const startSearchInput = document.getElementById(
      "start-search"
    ) as HTMLInputElement;
    if (startSearchInput) {
      startSearchInput.value = ""; // Clear the input value
    }

    // Reset the navigation state
    startSpace = null;
    endSpace = null;
    navigationState.isPathDrawn = false;

    // Clear paths and markers if needed
    mapView.Paths.removeAll();
    mapView.Markers.removeAll();
    setSpaceInteractivity(true);

    console.log("Navigation stopped and URL cleared.");
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
  stackMapButton.className = "stackmap-btn";
  //stackMapButton.textContent = i18n.t("StackMap");

  // 2. Create the icon element
  const icon = document.createElement("i");
  icon.className = "fa fa-cube"; // Font Awesome class for the book icon
  icon.style.fontSize = "20px"; // Set the font size

  // Append the icon to the button
  stackMapButton.appendChild(icon);

  // Append the button to the desired parent element:
  //mappedinDiv.appendChild(stackMapButton);

  // 2. Find the `.drop-menu.dropup` container
  const dropMenuContainer = document.querySelector(".drop-menu.dropup");

  // 3. Find the settings button
  const settingsButton = document.querySelector(
    ".drop-menu.dropup .settings-btn"
  );

  // 4. Append the stackMapButton to the container
  if (dropMenuContainer) {
    dropMenuContainer.insertBefore(stackMapButton, settingsButton);
  } else {
    console.error("The .drop-menu.dropup container was not found.");
  }

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
  // The enable Button is used to enable and disable Stacked Maps.
  // The enable Button is used to enable and disable Stacked Maps.
  stackMapButton.onclick = () => {
    // Debug here:
    console.log("Checking noShowFloor2", noShowFloor2);

    // Toggle the 'active' class
    if (stackMapButton.classList.contains("active")) {
      // Collapse the stack map
      mapView.collapse();
      stackMapButton.classList.remove("active");
      stackMapButton.style.backgroundColor = "#f9f9f9"; // Reset background color
      setCameraPosition(mapView.currentFloor.id);
    } else {
      // Show the stack map and hide the unused floor
      mapView.expand({ excludeFloors: noShowFloor2 });
      stackMapButton.classList.add("active");
      stackMapButton.style.backgroundColor = "#27b7ff"; // Set background color to yellow

      // Set the camera to zoomLevel 17 and pitch 0
      mapView.Camera.animateTo({
        bearing: floorSettings[mapView.currentFloor.id].bearing, // Set the angle, e.g. North or South facing
        zoomLevel: 18.7, // Set the zoom level, better in 17-22
        pitch: 85, // The angle from the top-down (0: Top-down, 90: Eye-level)
      });
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
  emergencyButton.className = "emergency-btn";
  //emergencyButton.textContent = "Emergency Exit";
  
  emergencyButton.style.backgroundColor = "#FF0000"; //red bg color
  emergencyButton.style.color = "#FFFFFF"; //white font color
  
  emergencyButton.style.cursor = "pointer";
  emergencyButton.setAttribute("data-emergency-btn", "true");

  // 2. Create the icon element
  const iconEmergency = document.createElement("i");
  iconEmergency.className = "fa fa-sign-out"; // Font Awesome class for the book icon
  iconEmergency.style.fontSize = "28px"; // Set the font size

  // Append the icon to the button
  emergencyButton.appendChild(iconEmergency);

  // Append the button to the map container
  mappedinDiv.appendChild(emergencyButton);

  let emergencyExitOn = false;

  emergencyButton.addEventListener("click", function () {
    if (emergencyExitOn) {
      // If the emergency exit is already on, turn it off
      mapView.Paths.removeAll();
      mapView.Markers.removeAll();
      path = null;
      emergencyButton.textContent = "Emergency Exit";
      emergencyButton.style.backgroundColor = "#FF0000"; //red bg color
      emergencyExitOn = false;

      mapData.getByType("space").forEach((space) => {
        const currentState = mapView.getState(space);
        const currentColor = currentState ? currentState.color : null;

        const targetColor = "#d4b2df";
        const newColor = "#eeece7";

        if (currentColor === targetColor) {
          mapView.updateState(space, {
            color: newColor,
          });
        }
      });

      setSpaceInteractivity(true);

      const startSearchBar = document.getElementById(
        "start-search"
      ) as HTMLInputElement;
      const endSearchBar = document.getElementById(
        "end-search"
      ) as HTMLInputElement;
      if (startSearchBar) startSearchBar.value = "";
      if (endSearchBar) endSearchBar.value = "";

      // Reset start and end spaces regardless of path state
      startSpace = null;
      endSpace = null;
      startSpace = null;
      endSpace = null;
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
          mapView.Navigation.draw(shortestWayout3, {
            pathOptions: {
              nearRadius: 0.5, // Customize these as per your current map styling needs
              farRadius: 0.5,
              color: "red", // This sets the path color, adjust if necessary
            },
          });
          //emergencyButton.textContent = "Emergency Off";
          emergencyButton.style.backgroundColor = "#28a745";
          emergencyExitOn = true;
        }
        setSpaceInteractivity(false);
      } else {
        // Show popup if startSpace is false
        alert("Please select starting point.");
        console.error("Please select start space locations.");
      }
    }
  });

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
      //added this one, when user input, hide the dropdown list, and show the input result
      hideDropdown(searchListEndPoint);
      endResultsContainer.style.display = "block";
    } else {
      endResultsContainer.style.display = "none";
    }
  });

  startSearchBar.addEventListener("input", function () {
    const query = startSearchBar.value.toLowerCase();
    if (query) {
      performSearch(query, "start");
      //added this one, when user input, hide the dropdown list, and show the input result
      hideDropdown(searchList);
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
    mapData.getByType("space").forEach((space) => {
      // Retrieve the current state of the space to check its color
      const currentState = mapView.getState(space);
      const currentColor = currentState ? currentState.color : null;

      // Define the color you are looking for and the new color to apply
      const targetColor = "#d4b2df";
      const newColor = "#eeece7";

      // Check if the current color matches the target color
      if (currentColor === targetColor) {
        mapView.updateState(space, {
          color: newColor,
        });
      }
    });

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
    startSpace = null;
    endSpace = null;
    startSpace = null;
    endSpace = null;
  });
  // Get Directions Button
  const getDirectionsButton = document.getElementById(
    "get-directions"
  ) as HTMLButtonElement;

  //Testing the direction button and stop navigation button text change function:
  updateButtonText();

  getDirectionsButton.addEventListener("click", async function () {
    //can add a function to change the startSearchBar.value into Space (string => Space?)
    //testing:
    // Check if the startSearchBar value is not empty
    if (startSearchBar.value.trim() !== "") {
      // Try to get the Space based on the startSearchBar value
      // Trim the input and capitalize the first letter
      let formattedValue = startSearchBar.value.trim();
      formattedValue = formattedValue.charAt(0).toUpperCase() + formattedValue.slice(1);

      startSpace = getSpaceByName(formattedValue) || null;
      
      //At here, we will hide the start result container:
      startResultsContainer.style.display = "none";
      //console.log("startSearchBar.value", startSearchBar.value);
      //console.log("startSpace", startSpace);
      // If the startSpace is not found, show an alert
      //if (!startSpace) {
        //alert("Please type or choose a correct start location name!");
        //return; // Exit the function if the space is not found
      //}
    } else {
      alert("Please select a start location.");
      return; // Exit the function if the search bar is empty
    }

    // Check if the endSearchBar value is not empty
    if (endSearchBar.value.trim() !== "") {
      // Trim the input and capitalize the first letter for endSearchBar
      let formattedEndValue = endSearchBar.value.trim();
      formattedEndValue = formattedEndValue.charAt(0).toUpperCase() + formattedEndValue.slice(1);

      endSpace = getSpaceByName(formattedEndValue) || null;

      // Hide the end result container
      endResultsContainer.style.display = "none";

      // If the endSpace is not found, show an alert
      //if (!endSpace) {
       // alert("Please type or choose a correct end location name!");
        //return; // Exit the function if the space is not found
      //}
    } else {
      alert("Please select an end location.");
      return; // Exit the function if the search bar is empty
    }

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
      console.log("Are on the same floor:", areOnSameFloor);

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
        console.error("Error fetching directions:", error);
        alert("Error fetching directions: " + error);
      }
    } else {
      alert("Please correctly select both start and end locations.");
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

  //testing here:
  // Function to hide or show dropdown based on the input value
  /* function toggleDropdownBasedOnValue(inputElement:HTMLInputElement, dropdownElement:HTMLDivElement) {
    if (inputElement.value.trim() !== "") {
      hideDropdown(dropdownElement); // Hide dropdown if the value is not empty
    } else {
      showDropdown(dropdownElement); // Show dropdown if the value is empty
    }
  } */

  // Show the dropdown when the user clicks on the search bar
  startSearchBar.addEventListener("focus", () => {
    //toggleDropdownBasedOnValue(startSearchBar, searchList);
    showDropdown(searchList);
    isModuleItemsVisible = false; // Reset the visibility flag when focusing on the search bar
    moduleItemsContainer.style.display = "none"; // Ensure Module item list is hidden
    isSurgeryCentreItemsVisible = false;
    surgeryCentreModuleItemsContainer.style.display = "none";
  });
  endSearchBar.addEventListener("focus", () => {
    // Added this block**
    showDropdown(searchListEndPoint);
    isModuleItemsVisibleEndPoint = false;
    moduleItemsContainerEndPoint.style.display = "none";
    isSurgeryCentreItemsVisibleEndPoint = false;
    surgeryCentreModuleItemsContainerEndPoint.style.display = "none";
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

  //testing the search bar dropdown list, start from here.....................
  //Making the new entrance dropdown button work:
  const entranceDropdownButton = document.getElementById(
    "new-entrance-button"
  ) as HTMLDivElement;
  const entranceDropdownButtonEndPoint = document.getElementById(
    "new-entrance-button-endpoint"
  ) as HTMLDivElement;

  // Event listener for start point
  entranceDropdownButton.addEventListener("click", () => {
    console.log("Entrance button at start point clicked.");
    
    // Find the space with the name "Entrance"
    const entranceSpace = mapData
      .getByType("space")
      .find((space) => space.name.includes("Main Entrance"));

    // Update startSpace with the found space
    startSpace = entranceSpace!;
    startSearchBar.value = "Main Entrance";//need to be Main Entrance!!!!!
    console.log("startSpace updated as Entrance:", startSpace);
  });

  // Event listener for end point (if required)
  entranceDropdownButtonEndPoint?.addEventListener("click", () => {
    console.log("Entrance button at end point clicked.");
    
    // Find the space with the name "Entrance"
    const entranceSpaceEnd = mapData
      .getByType("space")
      .find((space) => space.name.includes("Main Entrance"));

    // Update endSpace with the found space
    endSpace = entranceSpaceEnd!;
    endSearchBar.value = "Main Entrance"; //need to be Main Entrance!!!!!
    console.log("endSpace updated as Entrance:", endSpace);
  });
  //new entrance button finish.........................................



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

  //testing create a new module list for superClinic Locations........................
  const populateModuleRooms = (container: HTMLDivElement) => {
    const spaces: Space[] = mapData.getByType("space");
    container.innerHTML = ""; // Clear existing items
  
    // Define the specific order for Module spaces
    const moduleOrder = [
      "Module 1",
      "Module 2",
      "Module 2a",
      "Module 2b",
      "Module 3",
      "Module 4",
      "Module 5",
      "Module 6",
      "Module 6 Reception",
      "Module 7",
      "Module 7a",
      "Module 8",
      "Module 9",
      "Module 10",
      "Module 11",
    ];
  
    // Filter and group spaces into categories
    const cafes = spaces.filter(space => space.name === "Cafe");
    const clinicalPhotography = spaces.filter(space => space.name === "Clinical Photography");
    const superClinicReception = spaces.filter(space => space.name === "SuperClinic Reception");
  
    // Filter for Module spaces and sort them in the desired order
    const modules = spaces
      .filter(space => space.name.includes("Module"))
      .sort((a, b) => {
        const indexA = moduleOrder.indexOf(a.name);
        const indexB = moduleOrder.indexOf(b.name);
        return indexA - indexB;
      });
  
    // Concatenate all the space groups in the desired order
    const sortedSpaces = [...cafes, ...clinicalPhotography, ...modules, ...superClinicReception];
  
    // Populate the container with the sorted spaces
    sortedSpaces.forEach((space) => {
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

  //New entrence button for surgery centre entre:
  //Making the new entrance dropdown button work:
  const surgeryCentreEntranceDropdownButton = document.getElementById(
    "new-entrance-button-surgeryCentre"
  ) as HTMLDivElement;
  const surgeryCentreEntranceDropdownButtonEndPoint = document.getElementById(
    "new-entrance-button-surgeryCentre-endpoint"
  ) as HTMLDivElement;

  // Event listener for start point
  surgeryCentreEntranceDropdownButton.addEventListener("click", () => {
    console.log("Entrance button at start point clicked.");
    
    // Find the space with the name "Entrance"
    const entranceSpace = mapData
      .getByType("space")
      .find((space) => space.name.includes("Entrance(surgical centre)"));

    // Update startSpace with the found space
    startSpace = entranceSpace!;
    startSearchBar.value = "Entrance(surgical centre)";
    console.log("startSpace updated as Entrance:", startSpace);
  });

  // Event listener for end point (if required)
  surgeryCentreEntranceDropdownButtonEndPoint?.addEventListener("click", () => {
    console.log("Entrance button at end point clicked.");
    
    // Find the space with the name "Entrance"
    const entranceSpaceEnd = mapData
      .getByType("space")
      .find((space) => space.name.includes("Entrance(surgical centre)"));

    // Update endSpace with the found space
    endSpace = entranceSpaceEnd!;
    endSearchBar.value = "Entrance(surgical centre)";
    console.log("endSpace updated as Entrance:", endSpace);
  });
  // New entrance button (surgery centre) finish.........................................

  // New surgery clinic centre locations list: 
  // Make the variable for the Module list button function:
  const surgeryCentreModuleItemsContainer = document.getElementById(
    "module-items-container-surgeryCentre"
  ) as HTMLDivElement;
  const surgeryCentreModuleButton = document.getElementById(
    "module-button-surgeryCentre"
  ) as HTMLButtonElement;

  const surgeryCentreModuleItemsContainerEndPoint = document.getElementById(
    "module-items-container-surgeryCentre-endpoint"
  ) as HTMLDivElement; // Added this line
  const surgeryCentreModuleButtonEndPoint = document.getElementById(
    "module-button-surgeryCentre-endpoint"
  ) as HTMLButtonElement; // Added this line

  // List of surgery centre spaces in the specified order
const surgeryCentreOrder = [
  "Renal - MSC Incentre Dialysis Unit",
  "Renal - Rito Dialysis Centre",
  "Surgical Centre Reception",
  "Ward (Level 1)",
  "Ward - Level 1 Reception",
  "Ward (Level 2)",
  "Ward - Level 2 Reception"
];

// Function to populate the surgery centre locations
const populateSurgeryCentreRooms = (container: HTMLDivElement) => {
  const spaces: Space[] = mapData.getByType("space");
  container.innerHTML = ""; // Clear existing items

  // Filter surgery center locations in the defined order
  const surgeryCentreSpaces = spaces
    .filter((space) => surgeryCentreOrder.includes(space.name));

  // Populate the container with the sorted spaces
  surgeryCentreSpaces.forEach((space) => {
    const spaceOption = document.createElement("button");
    spaceOption.className = "button-13";
    spaceOption.textContent = space.name; // The property containing the space name
    container.appendChild(spaceOption);

    // Add click event listener to capture the button text
    spaceOption.addEventListener("click", () => {
      const selectedSpaceName = spaceOption.textContent;

      if (selectedSpaceName) {
        const spaceInstance: Space | undefined = getSpaceByName(selectedSpaceName); // Convert text to Space type

        if (spaceInstance) {
          if (container === surgeryCentreModuleItemsContainer) {
            // Update startSpace with the Space instance for surgery centre
            startSpace = spaceInstance;
            startSearchBar.value = spaceOption.textContent!;
            console.log("startSpace updated:", startSpace);
            highlightSpace(startSpace);
          } else if (container === surgeryCentreModuleItemsContainerEndPoint) {
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
  });
};


// Flags to track the visibility of the surgeryCentreModuleItemsContainer
let isSurgeryCentreItemsVisible = false;
let isSurgeryCentreItemsVisibleEndPoint = false;

// Toggle surgery centre rooms visibility when the surgeryCentreModuleButton is clicked
surgeryCentreModuleButton.addEventListener("click", () => {
  if (isSurgeryCentreItemsVisible) {
    surgeryCentreModuleItemsContainer.style.display = "none"; // Hide if already visible
  } else {
    populateSurgeryCentreRooms(surgeryCentreModuleItemsContainer); // Populate the surgery centre rooms
    surgeryCentreModuleItemsContainer.style.display = "block"; // Show the surgery centre rooms
  }
  isSurgeryCentreItemsVisible = !isSurgeryCentreItemsVisible; // Toggle the flag
});

// Toggle surgery centre rooms visibility for the endpoint when the surgeryCentreModuleButtonEndPoint is clicked
surgeryCentreModuleButtonEndPoint.addEventListener("click", () => {
  if (isSurgeryCentreItemsVisibleEndPoint) {
    surgeryCentreModuleItemsContainerEndPoint.style.display = "none"; // Hide if already visible
  } else {
    populateSurgeryCentreRooms(surgeryCentreModuleItemsContainerEndPoint); // Populate the surgery centre rooms
    surgeryCentreModuleItemsContainerEndPoint.style.display = "block"; // Show the surgery centre rooms
  }
  isSurgeryCentreItemsVisibleEndPoint = !isSurgeryCentreItemsVisibleEndPoint; // Toggle the flag
});




  // New surgery clinic centre locations list finish............................. 

  //dropdown list end.......................................................

  // Define the toilets icon
  const toiletsIcon = `
<svg width="80" height="80" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g fill="black">
    <!-- Female -->
    <circle cx="16" cy="16" r="8" fill="pink" />
    <path d="M16 26c-4.418 0-8 3.582-8 8v4h16v-4c0-4.418-3.582-8-8-8z" fill="pink" />
    <path d="M10 34v10h12v-10H10z" fill="pink" />
    
    <!-- Male -->
    <circle cx="48" cy="16" r="8" fill="lightblue" />
    <path d="M48 26c-4.418 0-8 3.582-8 8v4h16v-4c0-4.418-3.582-8-8-8z" fill="lightblue" />
    <path d="M42 34v10h12v-10H42z" fill="lightblue" />
  </g>
</svg>`;

  // Define the coffee mug icon
  const coffeeMugIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
    <path d="M6 22C5.44772 22 5 21.5523 5 21V19H19V21C19 21.5523 18.5523 22 18 22H6Z" fill="#8B4513"/>
    <path d="M19 3H7C5.34315 3 4 4.34315 4 6V17H20V6C20 4.34315 18.6569 3 17 3H19Z" fill="#D3D3D3"/>
    <path d="M6 17C6 18.1046 6.89543 19 8 19H16C17.1046 19 18 18.1046 18 17H6Z" fill="#A0522D"/>
    <path d="M7 4C6.44772 4 6 4.44772 6 5V6H18V5C18 4.44772 17.5523 4 17 4H7Z" fill="#A0522D"/>
</svg>`;

  // Fetch and label toilets spaces
  mapData.getByType("space").forEach((space) => {
    if (space.name && space.name.toLowerCase().includes("toilets")) {
      mapView.Labels.add(space, space.name, {
        rank: "always-visible",
        appearance: {
          marker: {
            foregroundColor: {
              active: "white",
              inactive: "white",
            },
            icon: toiletsIcon,
          },
          text: {
            foregroundColor: "#063970",
          },
        },
      });
    }

    if (space.name && space.name.toLowerCase() === "cafe") {
      mapView.Labels.add(space, "Café", {
        rank: "high",
        appearance: {
          marker: {
            foregroundColor: {
              active: "white",
              inactive: "white",
            },
            icon: coffeeMugIcon,
          },
          text: {
            foregroundColor: "#063970",
          },
        },
      });
    }
  });
  // Define a new main entrance upright arrow icon pointing up
const mainEntranceArrowIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none">
    <path d="M12 19V6M12 6L7 11M12 6L17 11" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" />
    <circle cx="12" cy="6" r="2" fill="#4CAF50"/>
</svg>`;

// Fetch and label spaces
mapData.getByType("space").forEach((space) => {
  // Existing labeling logic for toilets and café...

  // Check if the space name contains "entrance" (case insensitive)
  if (space.name && space.name.toLowerCase().includes("entrance")) {
    mapView.Labels.add(space, space.name, { // Keep the original name here
      rank: "always-visible",
      appearance: {
        marker: {
          foregroundColor: {
            active: "white",
            inactive: "white",
          },
          icon: mainEntranceArrowIcon, // Use the new icon
        },
        text: {
          foregroundColor: "#063970",
        },
      },
    });
  }
});


  //////////////////////////////////////////
  //searchingBar Dropdown list function above.

  // Button Accessibility
  // Button Accessibility
  const accessibilityButton = document.createElement("button");
  accessibilityButton.innerHTML = `
   <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 512 512">
     <path fill="currentColor" d="M192 96a48 48 0 1 0 0-96a48 48 0 1 0 0 96m-71.5 151.2c12.4-4.7 18.7-18.5 14-30.9s-18.5-18.7-30.9-14C43.1 225.1 0 283.5 0 352c0 88.4 71.6 160 160 160c61.2 0 114.3-34.3 141.2-84.7c6.2-11.7 1.8-26.2-9.9-32.5s-26.2-1.8-32.5 9.9C240 440 202.8 464 160 464c-61.9 0-112-50.1-112-112c0-47.9 30.1-88.8 72.5-104.8M259.8 176l-1.9-9.7c-4.5-22.3-24-38.3-46.8-38.3c-30.1 0-52.7 27.5-46.8 57l23.1 115.5c6 29.9 32.2 51.4 62.8 51.4h100.5c6.7 0 12.6 4.1 15 10.4l36.3 96.9c6 16.1 23.8 24.6 40.1 19.1l48-16c16.8-5.6 25.8-23.7 20.2-40.5s-23.7-25.8-40.5-20.2l-18.7 6.2l-25.5-68c-11.7-31.2-41.6-51.9-74.9-51.9h-68.5l-9.6-48H336c17.7 0 32-14.3 32-32s-14.3-32-32-32h-76.2z"/>
   </svg>
 `;
  accessibilityButton.id = "accessibility-btn";

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
  // Check URL parameters on initialization
  const urlParams = new URLSearchParams(window.location.search);
  const startSpaceIdFromUrl = urlParams.get("startSpace");
  const endSpaceIdFromUrl = urlParams.get("endSpace");

  // Handle setting the start space from URL
  if (startSpaceIdFromUrl) {
    const space = cachedSpaces.find(
      (space) => space.id === startSpaceIdFromUrl
    );

    if (space) {
      // Set the start space first
      startSpace = space; // Set the start space
      localStorage.setItem("startSpaceId", startSpaceIdFromUrl); // Update local storage

      // Highlight the start space on the map
      mapView.updateState(space, { color: "#d4b2df" }); // Highlight the space

      // Update the search bar with the start space name
      updateSearchBarWithStartSpace(space.id);

      // Show loading spinner if it exists
      const loadingSpinner = document.getElementById("loading-spinner");
      if (loadingSpinner) {
        loadingSpinner.style.display = "block"; // Show loading
      }

      // Change the floor asynchronously
      await mapView.setFloor(space.floor.id);

      // After changing the floor, reapply interactivity
      setTimeout(() => {
        mapData.getByType("space").forEach((space) => {
          mapView.updateState(space, {
            interactive: true, // Make spaces interactive again
            hoverColor: "#BAE0F3",
          });
        });

        // Hide the loading spinner after the floor change
        if (loadingSpinner) {
          loadingSpinner.style.display = "none";
        }
      }, 1000); // Adjust this timeout as needed (1 second delay)

      console.log("Start space set from URL:", startSpaceIdFromUrl);
    } else {
      console.error("Start space ID from URL not found in cached spaces.");
    }
  } else {
    console.log("No start space ID found in URL.");
  }

  // Handle setting the end space from URL

  if (endSpaceIdFromUrl) {
    const space = cachedSpaces.find((space) => space.id === endSpaceIdFromUrl);
    if (space) {
      endSpace = space;
      const endSearchInput = document.getElementById(
        "end-search"
      ) as HTMLInputElement;
      if (endSearchInput) endSearchInput.value = space.name;
    }
  }
}

init();