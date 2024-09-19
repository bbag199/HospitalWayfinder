declare const google: any;

export class RealTimeLocationTracker {
  watchId: number | null = null;
  map: any;
  marker: any;
  istracking: boolean = false; //to control real time tracking

  constructor(map: google.maps.Map) {
    //testing
    this.map = map;
  }

  // Initialize Google Maps inside the RealTimeLocationTracker class
  static async initializeGoogleMap(
    mapElementId: string
  ): Promise<RealTimeLocationTracker> {
    const mapOptions = {
      center: { lat: -37.0082, lng: 174.887104 }, // Initial map center
      zoom: 16, // Initial zoom level
    };

    const googleMap = new google.maps.Map(
      document.getElementById(mapElementId) as HTMLElement,
      mapOptions
    );

    return new RealTimeLocationTracker(googleMap);
  }
  // start tracking
  startTracking() {
    if (navigator.geolocation && !this.istracking) {
      this.istracking = true;
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
          timeout: 5000, // 5 seconds timeout for position acquisition
          maximumAge: 0, //fetch fresh position each time
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
      this.watchId = null;
      console.log("Stop tracking");
    }

    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
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

    if (!this.marker) {
      this.marker = new google.maps.Marker({
        position: pos,
        map: this.map,
        icon: {
          url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });
    } else {
      this.marker.setPosition(pos);
    }

    this.map.setCenter(pos);
  }

  // Handle errors
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
      default:
        alert("An unknown error occurred.");
        break;
    }
  }
}

let locationTracker: RealTimeLocationTracker | null = null;

export async function getLocationTracker(
  mapElementId: string
): Promise<RealTimeLocationTracker> {
  if (!locationTracker) {
    locationTracker = await RealTimeLocationTracker.initializeGoogleMap(
      mapElementId
    );
  }
  return locationTracker;
}
