import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Coordinates, Geolocation } from "@ionic-native/geolocation/ngx";
import { IonSlides, Platform } from "@ionic/angular";
import { catchError, tap } from "rxjs/operators";
import { KioskOMModel } from "../models/kiosk-om.model";
import { KioskLocatorService } from "../services/kiosk-locator-service/kiosk-locator.service";
import {
  GOOGLE_MAPS_STYLES_OBJECT,
  KIOSK_VIEW,
  MAP_CARDS_SLIDES_OPTIONS,
  SEARCH_SIZE,
} from "../services/kiosk-locator-service/kiosk.utils";

// declare var google: any;
@Component({
  selector: "app-kiosk-locator",
  templateUrl: "./kiosk-locator.page.html",
  styleUrls: ["./kiosk-locator.page.scss"],
})
export class KioskLocatorPage implements OnInit {
  @ViewChild("map") mapElement: ElementRef;
  @ViewChild("slides") sliders: IonSlides;
  map: google.maps.Map;
  apiKey = "AIzaSyAfqTLg3_OIhgZIWG3LZTlLA0sEMAdrMso";
  searchInput: string;
  KIOSK_VIEW = KIOSK_VIEW;
  currentView: KIOSK_VIEW = KIOSK_VIEW.VIEW_CARDS;
  currentKiosk: any;
  slideOptions = MAP_CARDS_SLIDES_OPTIONS;
  searchForm: FormGroup;
  userPosition: Coordinates;
  kiosksArray: KioskOMModel[] = [];
  page = 0;
  loadingKiosk = true;
  markers: google.maps.Marker[] = [];
  selectedKioskIndex: number;
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;

  constructor(
    private geolocation: Geolocation,
    private kioskLocatorService: KioskLocatorService,
    private formBuilder: FormBuilder,
    private platform: Platform
  ) {}

  async ionViewDidEnter() {
    const ready = await this.platform.ready();
    console.log(ready);
    this.loadGoogleMaps();
  }

  ngOnInit() {
    // this.loadGoogleMaps();
    this.setForm();
  }

  setForm() {
    this.searchForm = this.formBuilder.group({
      kioskInput: [""],
    });
  }

  loadKiosk(isFirstLoad: boolean, event) {
    const params = {
      page: this.page,
      size: SEARCH_SIZE,
      latitude: this.userPosition.latitude,
      longitude: this.userPosition.longitude,
    };
    this.kioskLocatorService
      .getKiosks(params)
      .pipe(
        tap((kiosks: KioskOMModel[]) => {
          if (isFirstLoad) {
            this.loadingKiosk = false;
          } else {
            event.target.complete();
          }
          this.kiosksArray = this.kiosksArray.concat(kiosks);
          for (let [i, kiosk] of kiosks.entries()) {
            this.addMarker(kiosk, (i + 1).toString());
          }
          this.page++;
        }),
        catchError((err) => {
          throw new Error(err);
        })
      )
      .subscribe();
  }

  toggleView(view: KIOSK_VIEW) {
    if (this.currentView === KIOSK_VIEW.VIEW_ITINERAIRE) {
      this.markers.forEach((marker) => {
        marker.setMap(this.map);
      });
      this.directionsRenderer.setMap(null);
    }
    this.currentView = view;
  }

  async loadGoogleMaps() {
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
    const position = await this.geolocation.getCurrentPosition();
    console.log(position);
    this.userPosition = position.coords;
    const latLng = new google.maps.LatLng(
      this.userPosition.latitude,
      this.userPosition.longitude
    );
    let mapOptions: google.maps.MapOptions = {
      center: latLng,
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      styles: GOOGLE_MAPS_STYLES_OBJECT,
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.addUserMarker(this.userPosition.latitude, this.userPosition.longitude);
    this.loadKiosk(true, {});
  }

  initDIrectionServices() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
    });
  }

  addUserMarker(lat, lng) {
    const myLatLng = { lat, lng };
    new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      icon: {
        url: "http://maps.google.com/mapfiles/kml/paddle/wht-blank.png",
      },
    }).addListener("click", () => {
      new google.maps.InfoWindow({
        content: "<div>Ma position</div>",
      }).open(this.map);
    });
  }

  addMarker(kiosk: KioskOMModel, index?) {
    const myLatLng = new google.maps.LatLng(kiosk.latitude, kiosk.longitude);
    const marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      label: index,
      title: "Hello World!",
    });
    marker.addListener("click", () => {
      this.onSelectKiosk(kiosk, index);
    });
    this.markers.push(marker);
  }

  clearAllMarkers() {
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });
  }

  onSelectKiosk(kiosk: KioskOMModel, i: number) {
    this.currentKiosk = kiosk;
    this.selectedKioskIndex = i;
    this.currentView = KIOSK_VIEW.VIEW_ITINERAIRE;
    this.clearAllMarkers();
    this.addMarker(kiosk, i.toString());
    this.showDirections(kiosk, google.maps.TravelMode.DRIVING, "blue");
    this.showDirections(kiosk, google.maps.TravelMode.WALKING, "pink");
  }

  showDirections(
    kiosk: KioskOMModel,
    travelMode: google.maps.TravelMode,
    color?
  ) {
    this.initDIrectionServices();
    this.directionsRenderer.setMap(this.map);
    this.calculateAndDisplayRoute(kiosk, travelMode);
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

  calculateAndDisplayRoute(
    kiosk: KioskOMModel,
    travelMode: google.maps.TravelMode
  ) {
    const destination = `${kiosk.latitude}, ${kiosk.longitude}`;
    const origin = `${this.userPosition.latitude}, ${this.userPosition.longitude}`;
    this.directionsService.route(
      {
        origin,
        destination,
        travelMode,
      },
      (response) => {
        this.directionsRenderer.setDirections(response);
      }
    );
  }

  onInput(event) {
    const value = event.target.value;
    this.searchInput = value;
    if (!!value) {
      this.currentView = KIOSK_VIEW.VIEW_SEARCH;
    }
  }

  onSearchEmitted(event) {
    if (event.kiosk) {
      this.onSelectKiosk(event.kiosk, event.index);
    } else {
      this.currentView = KIOSK_VIEW.VIEW_CARDS;
      this.markers.forEach((marker) => {
        marker.setMap(this.map);
      });
      this.searchForm.reset();
    }
  }

  onSlideChanged(ev) {
    this.sliders.getActiveIndex().then((index) => {
      const correspondingKiosk = this.kiosksArray.find((kiosk, i) => {
        return i === index;
      });
      this.map.setZoom(16);
      this.map.panTo(
        new google.maps.LatLng(
          correspondingKiosk.latitude,
          correspondingKiosk.longitude
        )
      );
    });
  }
}

// console.log(
//   this.kioskLocatorService.getDistanceBetweenPoints(
//     { lat: kiosk.latitude, lng: kiosk.longitude },
//     { lat: position.coords.latitude, lng: position.coords.longitude }
//   )
// );
// this.distanceMatrix(
//   { lat: kiosk.lat, lng: kiosk.long },
//   { lat: position.coords.latitude, lng: position.coords.longitude }
// );
// this.showDirections();
