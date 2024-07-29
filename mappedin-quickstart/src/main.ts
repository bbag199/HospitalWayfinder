import { getMapData, show3dMap, MapView, Space, Path, Coordinate } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";


// See Trial API key Terms and Conditions
// https://developer.mappedin.com/web/v6/trial-keys-and-maps/
const options = {

  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  mapId: '6637fd20269972f02bf839da',
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

  // Add interactive space and pathfinding functionality
  let startSpace: Space | null = null;
  let path: Path | null = null;

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
        color: "#0000FF" // Set path color to blue
      });
    } else if (path) {
      mapView.Paths.remove(path);
      startSpace = null;
      path = null;
    }
  });

  // Set the camera position with final bearing and zoom level
  const setCameraPosition = () => {
    const entranceCoordinate = new Coordinate(-37.007839, 174.888214); // Replace with actual coordinates

    // Set the camera position with final bearing and zoom level
    mapView.Camera.animateTo(
      {
        bearing: 167.5 + 10, // Total rotation of 177.5 degrees (167.5 + 10)
        pitch: 80,
        zoomLevel: 1500, // Increase zoom level to zoom out further
        center: entranceCoordinate,
      },
      { duration: 2000 } // Set duration to 0 for an instant move
    );
  };

  // Call the function to set the camera position
  setCameraPosition();

  // Iterate through each point of interest and label it.
for (const poi of mapData.getByType('point-of-interest')) {
	// Label the point of interest if it's on the map floor currently shown.
	if (poi.floor.id === mapView.currentFloor.id) {
		mapView.Labels.add(poi.coordinate, poi.name);
	}
}

  console.log(mapData.getByType("floor"));


  //get the current position at the map (use the simulate location)
  //map should have the emergency door coordinate (three in the map) (x,y,floor)
  //1) click to get the current start location.
  //2) press the "Emergency door button in the screen"
  //3) show the path(Yello Line) start location to the near exit door.
  //const exitDoor1 = new Coordinate(exitDoorLatitude, exitDoorLongitude, exitDoorId, exitDoorFloorId);
  //const exitDoor2 = new Coordinate(exitDoorLatitude, exitDoorLongitude, exitDoorId, exitDoorFloorId);
  //const exitDoor3 = new Coordinate(exitDoorLatitude, exitDoorLongitude, exitDoorId, exitDoorFloorId);
  //console.log('Exit door coordinate predefined:', exitDoorCoordinate);
  // Add interactive space and pathfinding functionality
  let startPosition: Coordinate | null = null;
  //startPosition = mapView.createCoordinateFromScreenCoordinate;

  mapView.on("click", async (event) => {
    const startPosition = mapView.createCoordinateFromScreenCoordinate;
    console.log('start position coordinate defined:', startPosition);
    console.log('start position coordinate defined:', startPosition.toString);
  });
  console.log('start position:', startPosition);

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

  //emergency exit build here:
  const emergencyExits = [
    new Coordinate(-37.008839, 174.888214),
    new Coordinate(-37.007839, 178.889214)   
  ];

  // Set the start position on map click
  mapView.on("click", (event) => {
    if (!event || !event.spaces.length) return;
      startSpace = event.spaces[0];
      console.log('Start position set:', startSpace.description);
  });

  //after press the button, will show the yellow route to exit door.
  // Assuming `emergencyButton`, `startSpace`, and `emergencyExits` are already defined
emergencyButton.addEventListener("click", (event) => {
  if (!event) return;

  console.log("click already");
  console.log("check startSpace:", startSpace);
  
  if (!startSpace) return;

  let closestExit = emergencyExits[0];
  console.log("check endCoordinate:", closestExit);

  // Assuming `mapView.getDirections` is a function that returns directions
  const directions2 = mapView.getDirections(startSpace, closestExit);
  console.log("check directions:", directions2);

  if (!directions2) return;

  const path = mapView.Paths.add(directions2.coordinates, {
    nearRadius: 0.5,
    farRadius: 0.5,
    color: "#FFFF00" // Set path color to yellow
  });
});
};


  // Add an interactive {@link Marker} to the map with custom HTML content.
  //map.Markers.add(coordinate, '<div>Marker Content</div>', { interactive: true });




init();
