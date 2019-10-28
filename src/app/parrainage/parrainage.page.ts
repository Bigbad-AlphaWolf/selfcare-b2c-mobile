import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalController } from '@ionic/angular';
import { CreateSponsorFormComponent } from './create-sponsor-form/create-sponsor-form.component';

@Component({
  selector: 'app-parrainage',
  templateUrl: './parrainage.page.html',
  styleUrls: ['./parrainage.page.scss']
})
export class ParrainagePage implements OnInit {
  listSponseeShown: any[];
  listSponsee: any[];
  loadingSponsees = false;
  hasLoadingError = false;
  selectedFilter: 'NONE' | 'NON_INSCRITS' | 'INSCRITS' = 'NONE';
  mockData: any[] = [
    {
      msisdn: '77 589 62 87',
      firstname: 'Pape Abdoulaye',
      lastname: 'KEBE',
      effectif: true
    },
    {
      msisdn: '77 133 12 25',
      firstname: 'Momar',
      lastname: 'KEBE',
      effectif: false
    },
    {
      msisdn: '77 510 90 27',
      firstname: 'Mor Talla',
      lastname: 'KEBE',
      effectif: true
    },
    {
      msisdn: '77 102 28 35',
      firstname: 'Fatou Bintou',
      lastname: 'KEBE',
      effectif: false
    },
    {
      msisdn: '77 755 91 55',
      firstname: 'Ndeye Astou',
      lastname: 'KEBE',
      effectif: true
    }
  ];
  constructor(
    public dialog: MatDialog,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.getAllSponsees();
  }

  getAllSponsees() {
    this.listSponsee = this.mockData;
    this.listSponseeShown = this.mockData;
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: CreateSponsorFormComponent
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
          return sponsee.effectif;
        });
      } else {
        this.listSponseeShown = this.listSponsee.filter(sponsee => {
          return !sponsee.effectif;
        });
      }
    }
  }

  sendCallback(sponsee: any) {
    if (!sponsee.sendingCallback) {
      sponsee.sendingCallback = true;
      setTimeout(() => {
        sponsee.sendingCallback = false;
      }, 2000);
    }
  }

  goBack() {}

  openModalNewSponsee() {
    this.presentModal();
  }
}
