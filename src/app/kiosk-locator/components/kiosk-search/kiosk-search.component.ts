import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Coordinates } from '@ionic-native/geolocation/ngx';
import { IonInput } from '@ionic/angular';
import { catchError, tap } from 'rxjs/operators';
import { KioskOMModel } from 'src/app/models/kiosk-om.model';
import { KioskLocatorService } from 'src/app/services/kiosk-locator-service/kiosk-locator.service';
import { SEARCH_SIZE } from 'src/app/services/kiosk-locator-service/kiosk.utils';

@Component({
  selector: 'app-kiosk-search',
  templateUrl: './kiosk-search.component.html',
  styleUrls: ['./kiosk-search.component.scss'],
})
export class KioskSearchComponent implements OnInit {
  displaySearchIcon: boolean;
  @ViewChild('searchInput', { static: true }) input: IonInput;
  @Input() searchInput: string;
  @Input() userPosition: Coordinates;
  @Output() back = new EventEmitter();
  form: FormGroup;
  loadingKiosks: boolean;
  page = 0;
  kiosks: KioskOMModel[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private kiosksService: KioskLocatorService
  ) {}

  ngOnInit() {
    this.initForm();
    this.focusInput();
    this.loadKiosks();
  }

  loadKiosks() {
    this.loadingKiosks = true;
    const params = {
      page: this.page,
      size: SEARCH_SIZE,
      latitude: this.userPosition?.latitude,
      longitude: this.userPosition?.longitude,
      keyword: this.form?.value?.keyword,
    };
    this.kiosksService
      .getKiosks(params)
      .pipe(
        tap((kiosks) => {
          this.kiosks = kiosks;
          this.loadingKiosks = false;
        }),
        catchError((err) => {
          this.loadingKiosks = false;
          throw new Error(err);
        })
      )
      .subscribe();
  }

  onInputChange($event) {
    this.loadKiosks();
  }

  initForm() {
    this.form = this.formBuilder.group({
      keyword: [this.searchInput],
    });
  }

  focusInput() {
    setTimeout(() => {
      this.input.setFocus();
    }, 50);
  }

  goBack(selectedKiosk?: any, index?: number) {
    this.back.emit({ kiosk: selectedKiosk, index });
  }

  onClear() {
    this.form.patchValue({ keyword: '' });
  }
}
