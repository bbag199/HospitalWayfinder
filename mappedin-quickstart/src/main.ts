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
    setCameraPosition(id); // Update the camera position when the floor changes
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

  // Mapping of floor IDs to their corresponding bearings and coordinates
  const floorSettings: { [key: string]: { bearing: number, coordinate: Coordinate } } = {
    'm_da4e469267051fe3': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104



    ) }, 
    'm_69cd3f0a0aca0001': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104



    ) }, 
    'm_79ab96f2683f7824': { bearing: 200, coordinate: new Coordinate(-37.008200, 174.887104



    ) }, 
    'm_984215ecc8edf2ba': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.888221



    ) },
    'm_94568a67928ac615': { bearing: 178.5, coordinate: new Coordinate(-37.008164, 174.888221



    ) },
  };

  // Set the camera position with final bearing, zoom level, and center coordinate
  const setCameraPosition = (floorId: string) => {
    const settings = floorSettings[floorId] || { bearing: 178.5, coordinate: new Coordinate(0, 0) };

    // Set the camera position with final bearing, zoom level, and center coordinate
    mapView.Camera.animateTo(
      {
        bearing: settings.bearing,
        pitch: 0,
        zoomLevel: 18, // Increase zoom level to zoom out further
        center: settings.coordinate,
      },
      { duration: 2000 }
    );
  };

 
  setCameraPosition(mapView.currentFloor.id);

  // Iterate through each Connection and label it.
  mapData.getByType("connection").forEach((connection) => {
    // Find the coordinates for the current floor.
    const coords = connection.coordinates.find(
      (coord) => coord.floorId === mapView.currentFloor.id
    );
   
    if (coords) {
      mapView.Labels.add(coords, connection.name);
    }
  });

  console.log(mapData.getByType("floor"));
}

init();
