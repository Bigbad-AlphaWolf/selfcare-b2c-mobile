import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { CreateSponsorFormComponent } from './create-sponsor-form/create-sponsor-form.component';
import { SponseeModel } from 'src/shared';
import { ParrainageService } from '../services/parrainage-service/parrainage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss']
})
export class ParrainagePage implements OnInit {
  listSponseeShown: any[];
  listSponsee: SponseeModel[];
  loadingSponsees = false;
  hasLoadingError = false;
  selectedFilter: 'NONE' | 'NON_INSCRITS' | 'INSCRITS' = 'NONE';
  mockData: SponseeModel[] = [
    {
      id: 1,
      msisdn: '775896287',
      firstName: 'Pape Abdoulaye',
      lastName: 'KEBE',
      effective: true,
      createdDate: '',
      enabled: true
    },
    {
      id: 2,
      msisdn: '771331225',
      firstName: 'Momar',
      lastName: 'KEBE',
      effective: false,
      createdDate: '',
      enabled: true
    },
    {
      id: 3,
      msisdn: '775109027',
      firstName: 'Mor Talla',
      lastName: 'KEBE',
      effective: true,
      createdDate: '',
      enabled: true
    },
    {
      id: 4,
      msisdn: '771022835',
      firstName: 'Fatou Bintou',
      lastName: 'KEBE',
      effective: false,
      createdDate: '',
      enabled: true
    },
    {
      id: 5,
      msisdn: '777559155',
      firstName: 'Ndeye Astou',
      lastName: 'KEBE',
      effective: true,
      createdDate: '',
      enabled: true
    }
  ];
  effectiveNumber = 0;
  notEffectiveNumber = 0;
  constructor(
    public dialog: MatDialog,
    public modalController: ModalController,
    private parrainageService: ParrainageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAllSponsees();
  }

  getAllSponsees() {
    this.loadingSponsees = true;
    this.hasLoadingError = false;
    this.parrainageService.getCurrentMsisdnSponsees().subscribe(
      (sponsees: [any]) => {
        this.loadingSponsees = false;
        this.listSponsee = sponsees;
        this.listSponseeShown = sponsees;
        this.getEffectiveNumber();
      },
      err => {
        this.loadingSponsees = false;
        this.hasLoadingError = true;
      }
    );
  }

  getEffectiveNumber() {
    this.effectiveNumber = 0;
    this.notEffectiveNumber = 0;
    this.listSponsee.forEach((sponsee: SponseeModel) => {
      sponsee.effective ? this.effectiveNumber++ : this.notEffectiveNumber++;
    });
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreateSponsorFormComponent
    });
    modal.onDidDismiss().then(() => {
      this.getAllSponsees();
    });
    return await modal.present();
  }

  filterBy(sponseeStatus: 'NONE' | 'NON_INSCRITS' | 'INSCRITS') {
    if (
      this.selectedFilter !== 'NONE' &&
      this.selectedFilter === sponseeStatus
    ) {
      this.selectedFilter = 'NONE';
      this.listSponseeShown = this.listSponsee;
    } else {
      this.selectedFilter = sponseeStatus;
      if (sponseeStatus === 'INSCRITS') {
        this.listSponseeShown = this.listSponsee.filter(sponsee => {
          return sponsee.effective;
        });
      } else {
        this.listSponseeShown = this.listSponsee.filter(sponsee => {
          return !sponsee.effective;
        });
      }
    }
  }

  sendCallback(sponsee: any) {
    if (!sponsee.sendingCallback) {
      sponsee.sendingCallback = true;
      this.parrainageService.sendSMSRappel(sponsee.msisdn).subscribe(
        res => {
          sponsee.sendingCallback = false;
          sponsee.CallbackSent = true;
          setTimeout(() => {
            sponsee.CallbackSent = false;
          }, 2000);
        },
        err => {
          sponsee.sendingCallback = false;
          sponsee.CallbackNotSent = true;
          setTimeout(() => {
            sponsee.CallbackNotSent = false;
          }, 2000);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  openModalNewSponsee() {
    this.presentModal();
  }
}
