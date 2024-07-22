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
        zoomLevel: 300, // Increase zoom level to zoom out further
        center: entranceCoordinate,
      },
      { duration: 2000 } // Set duration to 0 for an instant move
    );
  };

  // Call the function to set the camera position
  setCameraPosition();

  // Iterate through each point of interest and label it.
// for (const poi of mapData.getByType('point-of-interest')) {
// 	// Label the point of interest if it's on the map floor currently shown.
// 	if (poi.floor.id === mapView.currentFloor.id) {
// 		mapView.Labels.add(poi.coordinate, poi.name);
// 	}
// }



  console.log(mapData.getByType("floor"));

  //add labels for each map

  mapData.getByType("space").forEach((space) =>{
    if(space.name){
      mapView.Labels.add(space, space.name,{
        appearance: {
          text: {foregroundColor: "orange"}
        }
      })
    }
  })
}

init();
