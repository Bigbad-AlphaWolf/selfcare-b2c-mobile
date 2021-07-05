import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';

declare var google: any;
@Component({
  selector: 'app-kiosk-locator',
  templateUrl: './kiosk-locator.page.html',
  styleUrls: ['./kiosk-locator.page.scss'],
})
export class KioskLocatorPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  mapInitialised: boolean = false;
  apiKey = 'AIzaSyAfqTLg3_OIhgZIWG3LZTlLA0sEMAdrMso';
  kiosksArray = [
    { name: 'agence 1', lat: 14.735, long: -17.461 },
    // { name: "agence 2", lat: 14.766, long: -17.429 },
    // { name: "agence 3", lat: 14.726, long: -17.442 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
    // { name: "agence 1", lat: 14.735, long: -17.461 },
  ];

  constructor(private geolocation: Geolocation) {}

  ngOnInit() {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    window['mapInit'] = () => {
      this.initMap();
    };
    let script = document.createElement('script');
    script.id = 'googleMaps';
    script.src =
      'http://maps.google.com/maps/api/js?key=' +
      this.apiKey +
      '&callback=mapInit';
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
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addMarker(position.coords.latitude, position.coords.longitude);
    for (let kiosk of this.kiosksArray) {
      this.addMarker(kiosk.lat, kiosk.long);
      console.log(
        this.getDistanceBetweenPoints(
          { lat: kiosk.lat, lng: kiosk.long },
          { lat: position.coords.latitude, lng: position.coords.longitude },
          'km'
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
      title: 'Hello World!',
    });
  }

  getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371,
    };

    let R = earthRadius[units || 'miles'];
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
        travelMode: 'DRIVING',
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
        origin: '14.758707199999998, -17.4358528',
        destination: '14.735, -17.461',
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
