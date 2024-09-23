declare const google: any;

export class RealTimeLocationTracker {
  watchId: number | null = null;
  marker: any;
  istracking: boolean = false; //to control real time tracking
  initialCoordinate: any; //to store initial map coordinate
  mappedinMapView: any;
  mappedinMarker: any;

  constructor(mappedinMapView: any) {
    //testing
    this.mappedinMapView = mappedinMapView;
    this.mappedinMarker = null; //set null as default
    this.initialCoordinate = this.mappedinMapView.Camera.center;
  }

  static async getLocationTracker(
    mappedinMapView: any
  ): Promise<RealTimeLocationTracker> {
    return new RealTimeLocationTracker(mappedinMapView);
  }

  // start tracking
  startTracking() {
    if (navigator.geolocation && !this.istracking) {
      this.istracking = true;
      console.log("startTracking called");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // debug messages
          console.log("Geolocation access granted");
          console.log("Latitude: " + position.coords.latitude);
          console.log("Longitude: " + position.coords.longitude);
        },
        (error) => {
          //debug message
          console.log("Error accessing geolocation: ", error.message);
        }
      );
      //start watching location
      this.watchId = navigator.geolocation.watchPosition(
        this.updatePosition.bind(this),
        this.showError.bind(this),
        {
          enableHighAccuracy: true,
          timeout: 10000, // 10 seconds timeout for position acquisition
          maximumAge: 5000, //fetch fresh position every 5 seconds
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  // stop tracking
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      console.log("Geolocation watch cleared:", this.watchId); //testing
      this.watchId = null;
      console.log("Stop tracking");
    }

    if (this.mappedinMarker) {
      this.mappedinMapView.Markers.remove(this.mappedinMarker); //remove marker from mappedin map
      this.mappedinMarker = null;
    }

    if (this.initialCoordinate) {
      this.mappedinMapView.Camera.animateTo(
        { center: this.initialCoordinate, zoomLevel: 18 },
        { duration: 500 }
      );
    }

    this.istracking = false;
  }

  // update user's position on the map
  updatePosition(position: GeolocationPosition) {
    if (!this.istracking) return;

    const pos = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };

    //transfer coordinate from gps to mappedin by using createCoordinate
    const mappedinCoordinate = this.mappedinMapView.createCoordinate(
      pos.lat,
      pos.lng
    );

    console.log("Mappedin coordinate:", mappedinCoordinate); //testing

    //add marker to mappedin map
    if (!this.mappedinMarker) {
      this.mappedinMarker = this.mappedinMapView.Markers.add(
        mappedinCoordinate,
        `<div style="
        position: relative;
        width: 20px;
        height: 20px;
        background-color: rgba(0, 122, 255, 1);
        border-radius: 50%;
        animation: pulse 1.5s infinite;
        box-shadow: 0 0 15px rgba(0, 122, 255, 0.7);
      ">
      <div style="
        position: absolute;
        width: 200%;
        height: 200%;
        background-color: rgba(0, 122, 255, 0.3);
        border-radius: 50%;
        animation: pulse-ring 1.5s infinite;
        top: -10px;
        left: -10px;
        z-index: -1;
      "></div>
    </div>`,
        {
          rank: "always-visible",
          interactive: false,
          dynamicResize: true,
        }
      );
    } else {
      this.mappedinMapView.Markers.setPosition(
        this.mappedinMarker,
        mappedinCoordinate
      );
    }

    //set mappedin map center
    this.mappedinMapView.Camera.animateTo(
      {
        center: mappedinCoordinate,
        zoomLevel: 18,
      },
      {
        duration: 500,
      }
    );
  }

  //toggle real time tracking
  toggleTrackingButton(locationToggle: HTMLButtonElement) {
    let isTrackingEnabled = false;

    // event listener for enabling/disabling real time tracking
    locationToggle.addEventListener("click", () => {
      isTrackingEnabled = !isTrackingEnabled;

      if (isTrackingEnabled) {
        this.startTracking();
        locationToggle.classList.add("on");
      } else {
        this.stopTracking();
        locationToggle.classList.remove("on");
      }
    });
  }

  // error message
  showError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
    }
  }
}

let locationTracker: RealTimeLocationTracker | null = null;

export async function getLocationTracker(
  mappedinMapView: any
): Promise<RealTimeLocationTracker> {
  if (!locationTracker) {
    locationTracker = new RealTimeLocationTracker(mappedinMapView);
  }
  return locationTracker;
}
