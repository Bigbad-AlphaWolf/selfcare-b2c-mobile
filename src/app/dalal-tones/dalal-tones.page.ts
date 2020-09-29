import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DalalTonesGenreModel } from '../models/dalal-tones-genre.model';
import { DalalTonesSousGenreModel } from '../models/dalal-tones-sous-genre.model';
import { DalalTonesModel } from '../models/dalal-tones.model';
import { DalalTonesService } from '../services/dalal-tones-service/dalal-tones.service';
import { downloadAvatarEndpoint } from '../services/dashboard-service/dashboard.service';
import { DalalActivationSuccessModalComponent } from './components/dalal-activation-success-modal/dalal-activation-success-modal.component';
import { DalalActivationComponent } from './components/dalal-activation/dalal-activation.component';
const SINGLE_REQUEST_SIZE = 10;
@Component({
  selector: 'app-dalal-tones',
  templateUrl: './dalal-tones.page.html',
  styleUrls: ['./dalal-tones.page.scss'],
})
export class DalalTonesPage implements OnInit {
  genres$: Observable<DalalTonesGenreModel[]>;
  allGenres: DalalTonesGenreModel[];
  // variable used to check if genre is selected (in the array) to set a css class
  selectedGenres = [];
  // variable which contains specified filters (sous-genres) to make request
  selectedSousGenres: DalalTonesSousGenreModel[] = [];
  dalalTones: DalalTonesModel[] = [];
  page_number = 0;
  max_size: number;
  loadingDalal = true;
  loadingError: boolean;
  infiniteScrollDisabled: boolean;
  downloadAvatarEndpoint = downloadAvatarEndpoint;
  constructor(
    private dalalTonesService: DalalTonesService,
    private modalController: ModalController,
    private navController: NavController
  ) {}

  ngOnInit() {
    this.getGenresDalal();
    this.getDalalTones(true, '');
  }

  getGenresDalal() {
    this.genres$ = this.dalalTonesService.fetchDalalGenres().pipe(
      tap((allGenres) => {
        this.allGenres = allGenres;
      })
    );
  }

  getDalalTones(isFirstLoad: boolean, event, reqParams = {}) {
    this.loadingError = false;
    this.infiniteScrollDisabled = false;
    reqParams = {
      ...{ size: SINGLE_REQUEST_SIZE, page: this.page_number },
      ...reqParams,
    };
    this.dalalTonesService.fetchDalalTones(reqParams).subscribe(
      (dalalTonesRes: HttpResponse<DalalTonesModel[]>) => {
        if (isFirstLoad) {
          this.max_size = +dalalTonesRes.headers.get('X-Total-Count');
          this.loadingDalal = false;
        } else {
          event.target.complete();
        }
        this.dalalTones = this.dalalTones.concat(dalalTonesRes.body);
        if (this.dalalTones.length === this.max_size) {
          console.log('all data loaded');
          this.infiniteScrollDisabled = true;
        } else {
          this.page_number++;
        }
      },
      (err) => {
        this.loadingError = isFirstLoad;
        this.loadingDalal = false;
      }
    );
  }

  doInfinite(event) {
    let params = {};
    if (this.selectedSousGenres.length) {
      params = { code: this.selectedSousGenres.join(',') };
    }
    this.getDalalTones(false, event, params);
  }

  checkCategorySelected(genre) {
    return this.selectedGenres.includes(genre.nom);
  }

  reloadDalalTones() {
    this.loadingDalal = true;
    this.dalalTones = [];
    let params = {};
    if (this.selectedSousGenres.length)
      params = { code: this.selectedSousGenres.join(',') };
    this.page_number = 0;
    this.getDalalTones(true, '', params);
  }

  selectGenre(genre: DalalTonesGenreModel, sousGenreCode) {
    if (!this.selectedGenres.includes(genre.nom)) {
      this.selectedGenres.push(genre.nom);
    }
    const index = this.allGenres.map((genre) => genre.nom).indexOf(genre.nom);
    this.selectedSousGenres[index] = sousGenreCode;
    this.reloadDalalTones();
  }

  async openDalalActivationModal(choosenDalal: DalalTonesModel) {
    const modal = await this.modalController.create({
      component: DalalActivationComponent,
      cssClass: 'modalRecipientSelection',
      componentProps: { choosenDalal },
    });
    modal.onDidDismiss().then((response) => {
      if (response && response.data && response.data.success) {
        this.openDalalActivationSuccessModal(choosenDalal);
      }
    });
    return await modal.present();
  }

  async openDalalActivationSuccessModal(choosenDalal: DalalTonesModel) {
    const modal = await this.modalController.create({
      component: DalalActivationSuccessModalComponent,
      cssClass: 'dalal-success-modal',
      componentProps: { choosenDalal },
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {
      this.navController.pop();
    });
    return await modal.present();
  }
}
