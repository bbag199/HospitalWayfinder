import { MapView } from "@mappedin/mappedin-js";

const fontSizes = {
    normal: 16,
    medium: 24,
    large:32,
}

export function applyFontSize(size:string, mapView: MapView) {
    if(!mapView||!mapView.Labels){
        console.error("mapView is not initialized or mapView.Labels undefined");
        return;
    }

    mapView.Labels.removeAll();

    mapView.getMapData().getByType("space").forEach((space) => {
        if(space.name){
            mapView.Labels.add(space,space.name,{
                appearance: {
                    text:{
                        size:fontSizes[size]||fontSizes.normal,
                    },
                },
            });
        }
    });
}

export function fontSizesSwitcher(mapView:MapView){
    const fontSizeSelector = document.getElementById("font-size") as HTMLSelectElement;

    fontSizeSelector.addEventListener("change",(e) => {
        const selectedSize = (e.target as HTMLSelectElement).value;
        applyFontSize(selectedSize, mapView);
    });

    // initialise currently font size
    applyFontSize(fontSizeSelector.value, mapView);
}

(window as any).applyFontSize = applyFontSize;
(window as any).fontSizeSwitcher = fontSizesSwitcher;