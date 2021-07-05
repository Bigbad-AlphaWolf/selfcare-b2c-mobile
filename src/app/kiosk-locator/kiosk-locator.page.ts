import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ModalController } from "@ionic/angular";
import { KioskListModalComponent } from "./components/kiosk-list-modal/kiosk-list-modal.component";

declare var google: any;
@Component({
  selector: "app-kiosk-locator",
  templateUrl: "./kiosk-locator.page.html",
  styleUrls: ["./kiosk-locator.page.scss"],
})
export class KioskLocatorPage implements OnInit {
  @ViewChild("map") mapElement: ElementRef;

  map: any;
  mapInitialised: boolean = false;
  apiKey = "AIzaSyAfqTLg3_OIhgZIWG3LZTlLA0sEMAdrMso";
  kiosksArray = [
    { name: "agence 1", lat: 14.735, long: -17.461 },
    // { name: "agence 2", lat: 14.766, long: -17.429 },
    // { name: "agence 3", lat: 14.726, long: -17.442 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
  ];

  listViewActive = true;
  cardViewActive: boolean;
  slideOptions = {
    slidesPerView: 1.2,
    centeredSlides: true,
    spaceBetween: 15,
    speed: 600,
    effect: "coverflow",
  };

  constructor(
    private geolocation: Geolocation,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadGoogleMaps();
    // this.openKioskListModal();
  }

  toggleView() {
    this.listViewActive = !this.listViewActive;
  }

  async openKioskListModal() {
    const modal = await this.modalController.create({
      component: KioskListModalComponent,
      cssClass: "select-recipient-modal",
      showBackdrop: false,
      backdropDismiss: false,
    });
    modal.onWillDismiss().then((response: any) => {
      if (response && response.data) {
      }
    });
    return await modal.present();
  }

  loadGoogleMaps() {
    window["mapInit"] = () => {
      this.initMap();
    };
    let script = document.createElement("script");
    script.id = "googleMaps";
    script.src =
      "http://maps.google.com/maps/api/js?key=" +
      this.apiKey +
      "&callback=mapInit";
    document.body.appendChild(script);
  }

  async initMap() {
    this.mapInitialised = true;

    // Geolocation.getCurrentPosition().then((position) => {
    const position = await this.geolocation.getCurrentPosition();
    console.log(position);
    let latLng = new google.maps.LatLng(
      position.coords.latitude,
      position.coords.longitude
    );

    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: [
        { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
        {
          featureType: "administrative.locality",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "poi.park",
          elementType: "geometry",
          stylers: [{ color: "#263c3f" }],
        },
        {
          featureType: "poi.park",
          elementType: "labels.text.fill",
          stylers: [{ color: "#6b9a76" }],
        },
        {
          featureType: "road",
          elementType: "geometry",
          stylers: [{ color: "#38414e" }],
        },
        {
          featureType: "road",
          elementType: "geometry.stroke",
          stylers: [{ color: "#212a37" }],
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [{ color: "#9ca5b3" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry",
          stylers: [{ color: "#746855" }],
        },
        {
          featureType: "road.highway",
          elementType: "geometry.stroke",
          stylers: [{ color: "#1f2835" }],
        },
        {
          featureType: "road.highway",
          elementType: "labels.text.fill",
          stylers: [{ color: "#f3d19c" }],
        },
        {
          featureType: "transit",
          elementType: "geometry",
          stylers: [{ color: "#2f3948" }],
        },
        {
          featureType: "transit.station",
          elementType: "labels.text.fill",
          stylers: [{ color: "#d59563" }],
        },
        {
          featureType: "water",
          elementType: "geometry",
          stylers: [{ color: "#17263c" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#515c6d" }],
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [{ color: "#17263c" }],
        },
      ],
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(position.coords.latitude, position.coords.longitude);
    for (let kiosk of this.kiosksArray) {
      this.addMarker(kiosk.lat, kiosk.long);
      console.log(
        this.getDistanceBetweenPoints(
          { lat: kiosk.lat, lng: kiosk.long },
          { lat: position.coords.latitude, lng: position.coords.longitude },
          "km"
        )
      );
      this.distanceMatrix(
        { lat: kiosk.lat, lng: kiosk.long },
        { lat: position.coords.latitude, lng: position.coords.longitude }
      );
      this.showDirections();
    }
    // });
  }

  addMarker(lat, lng) {
    const myLatLng = { lat, lng };
    const map = this.map;
    new google.maps.Marker({
      position: myLatLng,
      map,
      title: "Hello World!",
    });
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371,
    };

    let R = earthRadius[units || "miles"];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad(lat2 - lat1);
    let dLon = this.toRad(lon2 - lon1);
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;
  }

  toRad(x) {
    return (x * Math.PI) / 180;
  }

  distanceMatrix(origin, dest) {
    origin = new google.maps.LatLng(origin.lat, origin.lng);
    dest = new google.maps.LatLng(dest.lat, dest.lng);
    const service = new google.maps.DistanceMatrixService();
    service
      .getDistanceMatrix({
        origins: [origin],
        destinations: [dest],
        travelMode: "DRIVING",
        avoidHighways: true,
        avoidTolls: true,
      })
      .then((res) => {
        console.log(res);
      });
  }

  showDirections() {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(this.map);
    this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    // const onChangeHandler = function () {
    //   this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    // };
    // (document.getElementById('start') as HTMLElement).addEventListener(
    //   'change',
    //   onChangeHandler
    // );
    // (document.getElementById('end') as HTMLElement).addEventListener(
    //   'change',
    //   onChangeHandler
    // );
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
      .route({
        origin: "14.758707199999998, -17.4358528",
        destination: "14.735, -17.461",
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
