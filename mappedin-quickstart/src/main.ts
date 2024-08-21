import { getMapData, show3dMap, MapView, Space, Path, Coordinate, Directions, show3dMapGeojson, Floor } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";



// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {
  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  //old ID: mapId: '6637fd20269972f02bf839da',
  mapId: '66b179460dad9e000b5ee951',
};

async function init() {
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
    mapData,
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

  // Add interactive space and pathfinding functionality
  // let startSpace: Space | null = null;
  // let path: Path | null = null;

  let startSpace: Space;
  let endSpace: Space | null = null;
  let path: Path | null = null;
  let selectingStart = true; // 

  // Set each space to be interactive and its hover color to orange.
  mapData.getByType("space").forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "#f26336",
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
      path = mapView.Paths.add(directions.coordinates, {
        nearRadius: 0.5,
        farRadius: 0.5,
        color: "orange" // Set path color to blue
      });
    } else if (path) {
      mapView.Paths.remove(path);
      path = null;
    }
  });

  
  const floorSettings: { [key: string]: { bearing: number, coordinate: Coordinate } } = {
    'm_9f758af082f72a25': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },
    'm_649c1af3056991cb': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104) },  
    'm_48ded7311ca820bd': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.887859) }, //ground floor id
    'm_4574347856f74034': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.887859) }, //level 1
  };

  const setCameraPosition = (floorId: string) => {
    const settings = floorSettings[floorId] || { bearing: 178.5, coordinate: new Coordinate(0, 0) };

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

  setCameraPosition(mapView.currentFloor.id); 



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
  const noShowFloor2: Floor[] = mapData.getByType("floor").filter((floor: Floor) => (floor.name !== "SuperClinic Level 1" && floor.name !== "SuperClinic & Surgical Centre Ground Lvl"));

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
  const exitSpace = mapData.getByType('object').find(object => object.name.includes("exit01")); //this one should be the main door 
  const exitSpace2 = mapData.getByType('object').find(object => object.name.includes("exit02"));  //this one should be the back door
   

  //add an emergency square button here: 
  const emergencyButton = document.createElement("button");
  //make this button has the same class of the stack map button 
  emergencyButton.className = "reset-button mi-button";
  
  emergencyButton.textContent = "Emergency Exit";
  emergencyButton.style.position = "absolute";
  emergencyButton.style.bottom = "18px";
  //emergencyButton.style.right = "10px";
  //emergencyButton.style.zIndex = "1000";
  //emergencyButton.style.padding = "10px";
  emergencyButton.style.backgroundColor = "#FF0000";
  //emergencyButton.style.color = "#FFFFFF";
  //emergencyButton.style.border = "none";
  //emergencyButton.style.borderRadius = "5px";
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
      //create two distance for exit01 and exit02, will check the shortest way out later:
      const directions = mapView.getDirections(startSpace, exitSpace!);
      const directions2 = mapView.getDirections(startSpace, exitSpace2!);
      //debug the distance here:
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
        });
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
   const endSearchBar = document.getElementById('end-search') as HTMLInputElement;
   const startSearchBar = document.getElementById('start-search') as HTMLInputElement;
   const endResultsContainer = document.getElementById('end-results') as HTMLDivElement;
   const startResultsContainer = document.getElementById('start-results') as HTMLDivElement;
 
   endSearchBar.addEventListener('input', function() {
     const query = endSearchBar.value.toLowerCase();
     if (query) {
      //if the user input something, the drop down list will hide and show the searching result:
       dropdown.style.display = 'none'; //the drop dowe list hiding when there is some input
       performSearch(query, 'end');
       endResultsContainer.style.display = 'block';
     } else {
       endResultsContainer.style.display = 'none';
     }
   });
  


   ///////////////////////////////////
   ///////////////////////////////////
   ///////////////////////////////////
   //testing the start search bar drop down list function:
   const spaces: Space[] = mapData.getByType("space");

   // Get the dropdown and input elements
    const dropdown = document.getElementById('end-dropdown') as HTMLDivElement;
    const searchInput = document.getElementById('end-search') as HTMLInputElement;

    if (dropdown && searchInput) {
    // Create "Module List" and "Toilet List" containers
    // Create "Module List" and "Toilet List" buttons
    const moduleListButton = document.createElement('button');
    moduleListButton.className = 'dropdown-item';
    moduleListButton.textContent = 'Module List';
    moduleListButton.style.cursor = 'pointer';
    moduleListButton.style.backgroundColor = 'transparent'; // Optional: Make it look like a div
    moduleListButton.style.border = 'none'; // Optional: Remove button border

    // Similarly, create the "Toilet List" button
    const toiletListButton = document.createElement('button');
    toiletListButton.className = 'dropdown-item';
    toiletListButton.textContent = 'Toilet List';
    toiletListButton.style.cursor = 'pointer';
    toiletListButton.style.backgroundColor = 'transparent'; // Optional: Make it look like a div
    toiletListButton.style.border = 'none'; // Optional: Remove button border

    // Append these buttons to the dropdown container 
    dropdown.appendChild(moduleListButton);
    dropdown.appendChild(toiletListButton);

    // Create a container for module items
    const moduleItemsContainer = document.createElement('div');
    moduleItemsContainer.style.display = 'none'; // Initially hidden
    moduleItemsContainer.className = 'module-items';
    dropdown.appendChild(moduleItemsContainer);

    // Create a container for toilet items
    const toiletItemsContainer = document.createElement('div');
    toiletItemsContainer.style.display = 'none'; // Initially hidden
    toiletItemsContainer.className = 'toilet-items';
    dropdown.appendChild(toiletItemsContainer);

    // Populate the lists with spaces
    spaces.forEach(space => {
        const spaceOption = document.createElement('button');
        spaceOption.className = 'dropdown-item';
        spaceOption.textContent = space.name; // The property containing the space name

        if (space.name.includes('Module')) {     
            moduleItemsContainer.appendChild(spaceOption);
        } else if (space.name.includes('Toilets')) {
            toiletItemsContainer.appendChild(spaceOption);
        }
    });

    // Handle "Module List" click to toggle sub-items
    moduleListButton.addEventListener('click', () => {
        const isVisible = moduleItemsContainer.style.display === 'block';
        moduleItemsContainer.style.display = isVisible ? 'none' : 'block';
    });

    // Handle "Toilet List" click to show items
    toiletListButton.addEventListener('click', () => {
      const isVisible = toiletItemsContainer.style.display === 'block';
      toiletItemsContainer.style.display = isVisible ? 'none' : 'block';
    });
      
      // Populate the dropdown with space names
     /*   spaces.forEach(space => {
          const spaceOption = document.createElement('div');
          spaceOption.className = 'dropdown-item';
          spaceOption.textContent = space.name; // The property containing the space name
          dropdown.appendChild(spaceOption);
      }); */ 

      // Function to show the dropdown
      const showDropdown = () => {
        
        dropdown.style.display = 'block';
      };
  
      // Function to hide the dropdown
      const hideDropdown = () => {
          dropdown.style.display = 'none';
      };
  
      // Show the dropdown when the user clicks on the search bar
      searchInput.addEventListener('focus', () => {    
          showDropdown();
      });
  
      // Prevent immediate hiding of the dropdown on click
      searchInput.addEventListener('click', (event) => {
          event.stopPropagation();
          showDropdown();
      });
  
      dropdown.addEventListener('click', (event) => {
          event.stopPropagation();
      });
  
      // Hide the dropdown when clicking outside of it, after a short delay
      document.addEventListener('click', function (event: MouseEvent) {
          if (!dropdown.contains(event.target as Node) && event.target !== searchInput) {
              setTimeout(() => {
                  hideDropdown();
              }, 150); // Adjust delay as needed
          }
      });

      //create function according to the input string to find the Space from database:
      function getSpaceByName(name: string): Space | undefined {
        // Retrieve the Space instance
        const spaceCollection: Space[] = mapData.getByType("space"); // get the space array from the mapData
        return spaceCollection.find(space => space.name === name);
      }

      // Allow selecting an item from the dropdown
       dropdown.addEventListener('click', function(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (target.classList.contains('dropdown-item') && target.classList.contains('module-items')) {
            searchInput.value = target.textContent || '';
            if(endSpace == null){
              endSpace = getSpaceByName(searchInput.value)!;
            }
            dropdown.style.display = 'none';
        }
      }); 

    } 

   ///////////////////////////////////
   ///////////////////////////////////
   ///////////////////////////////////
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