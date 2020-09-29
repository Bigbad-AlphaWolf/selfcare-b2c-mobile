import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DalalTonesModel } from 'src/app/models/dalal-tones.model';
import { DalalTonesService } from 'src/app/services/dalal-tones-service/dalal-tones.service';
import { downloadAvatarEndpoint } from 'src/app/services/dashboard-service/dashboard.service';
import { concatArtistsNames } from 'src/shared';

@Component({
  selector: 'app-dalal-activation',
  templateUrl: './dalal-activation.component.html',
  styleUrls: ['./dalal-activation.component.scss'],
})
export class DalalActivationComponent implements OnInit {
  @Input() choosenDalal: DalalTonesModel;
  choices = [
    { text: 'Tout mon répertoire', value: 'ALL' },
    { text: 'À un numéro', value: 'ONE' },
  ];
  currentChoice: string;
  activatingDalal: boolean;
  activationErrorMsg: string;
  activationHasError: boolean;
  downloadAvatarEndpoint = downloadAvatarEndpoint;
  constructor(
    public modalController: ModalController,
    private dalalTonesService: DalalTonesService
  ) {}

  ngOnInit() {
    console.log(this.choosenDalal);
  }

  setChoice(choice) {
    this.currentChoice = choice;
  }

  concatArtistsNames(artists: any[]) {
    return concatArtistsNames(artists);
  }

  onPhoneSelected($event) {}

  activateDalal() {
    this.activationHasError = false;
    this.activatingDalal = true;
    this.dalalTonesService.activateDalal(this.choosenDalal).subscribe(
      (res) => {
        this.activatingDalal = false;
        this.modalController.dismiss({ success: true });
      },
      (err) => {
        this.activatingDalal = false;
        this.activationHasError = true;
        this.activationErrorMsg =
          err && err.error && err.error.message
            ? err.error.message
            : 'Une erreur est survenue';
      }
    );
  }
}
