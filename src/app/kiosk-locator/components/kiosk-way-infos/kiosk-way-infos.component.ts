import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NO_AVATAR_ICON_URL } from 'src/shared';
import * as SecureLS from 'secure-ls';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import { KioskOMModel } from 'src/app/models/kiosk-om.model';
import { Coordinates } from '@ionic-native/geolocation/ngx';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-kiosk-way-infos',
  templateUrl: './kiosk-way-infos.component.html',
  styleUrls: ['./kiosk-way-infos.component.scss'],
})
export class KioskWayInfosComponent implements OnInit {
  avatarUrl: string = NO_AVATAR_ICON_URL;
  @Input() kiosk: KioskOMModel;
  @Input() index: number;
  @Input() userCurrentPosition: Coordinates;
  @Output() leave: EventEmitter<any> = new EventEmitter<any>();
  walkingMatrix: google.maps.DistanceMatrixResponse;
  drivingMatrix: google.maps.DistanceMatrixResponse;
  url: string;
  constructor(public ref: ChangeDetectorRef) {}

  ngOnInit() {
    const origin = {
      lat: this.userCurrentPosition?.latitude,
      lng: this.userCurrentPosition?.longitude,
    };
    const dest = { lat: this.kiosk?.latitude, lng: this.kiosk?.longitude };
    if (window.google) {
      this.distanceMatrix(origin, dest, google.maps.TravelMode?.DRIVING);
      this.distanceMatrix(origin, dest, google.maps.TravelMode?.WALKING);
    }
    let user = ls.get('user');
    if (user.imageProfil)
      this.avatarUrl = downloadAvatarEndpoint + user.imageProfil;
    this.openInGoogleMap(google.maps.TravelMode.WALKING);
  }

  distanceMatrix(origin, dest, travelMode: google.maps.TravelMode) {
    origin = new google.maps.LatLng(origin?.lat, origin?.lng);
    dest = new google.maps.LatLng(dest?.lat, dest?.lng);
    const service = new google.maps.DistanceMatrixService();
    service?.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [dest],
        travelMode,
      },
      (res) => {
        if (travelMode === google.maps.TravelMode?.DRIVING) {
          this.drivingMatrix = res;
        } else {
          this.walkingMatrix = res;
        }
        this.ref.detectChanges();
      }
    );
  }

  sortir() {
    this.leave.emit();
  }

  openInGoogleMap(travelMode: google.maps.TravelMode) {
    const origin = `${this.userCurrentPosition.latitude},+${this.userCurrentPosition.longitude}`;
    const dest = `${this.kiosk.latitude},+${this.kiosk.longitude}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}&travelmode=${travelMode}`;
    this.url = url;
  }
}
