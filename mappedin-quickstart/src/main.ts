import { getMapData, show3dMap } from "@mappedin/mappedin-js";
import "@mappedin/mappedin-js/lib/index.css";

// See Demo API key Terms and Conditions
// https://developer.mappedin.com/v6/demo-keys-and-maps/
const options = {
  key: '6666f9ba8de671000ba55c63',
  secret: 'd15feef7e3c14bf6d03d76035aedfa36daae07606927190be3d4ea4816ad0e80',
  mapId: '6637fd20269972f02bf839da'
};

async function init() {
  const mapData = await getMapData(options);
  const mapView = await show3dMap(document.getElementById('mappedin-map') as HTMLDivElement, mapData);

  //add interactive spaces
  mapData.getByType('space').forEach((space) => {
    mapView.updateState(space, {
      interactive: true,
      hoverColor: "orange",
    })
  })

  //add a label for each space
  mapData.getByType('space').forEach((space) => {
    if(space.name){
      mapView.Labels.add(space, space.name, {
        appearance: {
          text: {foregroundColor: "orange"}, 
        },
      });
    }
  });

  mapView.on("click", async (event) => {
    if (event.markers.length > 0) {
      console.log("Clicked on marker: " + event.markers[0].id);
      mapView.Markers.remove(event.markers[0]);
    } else {
      if (event.spaces.length > 0 && event.spaces[0].name) {
        const markerTemplate = `
                <div>
                  <style>
                  .marker {
                    display: flex;
                    align-items: center;
                    background-color: #fff;
                    max-height: 64px;
                    border: 2px solid grey;
                    padding: 4px 12px;
                    font-weight: bold;
                    font-family: sans-serif;
                  }
      
                  .marker img {
                    max-width: 64px;
                    max-height: 32px;
                    object-fit: contain;
                    margin-right: 12px;
                  }
                  </style>
                  <div class="marker">
                    <p>${event.spaces[0].name}</p>
                  </div>
                </div>`;

        mapView.Markers.add(event.coordinate, markerTemplate, {
          interactive: true,
          anchor: "left",
        });
      } else {
        mapView.Markers.add(event.coordinate, "<div>Unnamed Space</div>", {
          interactive: true,
          anchor: "right",
        });
      }
    }
  });
}

init();