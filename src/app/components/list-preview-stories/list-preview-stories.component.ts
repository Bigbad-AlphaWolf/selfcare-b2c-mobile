import {Component, OnInit} from '@angular/core';
import {AnimationController, ModalController} from '@ionic/angular';
import {VisualizeStoriesComponent} from '../visualize-stories/visualize-stories.component';

@Component({
  selector: 'app-list-preview-stories',
  templateUrl: './list-preview-stories.component.html',
  styleUrls: ['./list-preview-stories.component.scss']
})
export class ListPreviewStoriesComponent implements OnInit {
  constructor(public modalController: ModalController, public animationCtrl: AnimationController) {}

  ngOnInit() {}

  async presentModal() {
    const enterAnimation = (baseEl: any) => {
      const backdropAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('ion-backdrop')!)
        .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

      const wrapperAnimation = this.animationCtrl
        .create()
        .addElement(baseEl.querySelector('.modal-wrapper')!)
        .keyframes([
          {offset: 0, opacity: '0', transform: 'scale(0)'},
          {offset: 1, opacity: '0.99', transform: 'scale(1)'}
        ]);

      return this.animationCtrl
        .create()
        .addElement(baseEl)
        .easing('ease-out')
        .duration(500)
        .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
      return enterAnimation(baseEl).direction('reverse');
    };

    const modal = await this.modalController.create({
      component: VisualizeStoriesComponent,
      //enterAnimation,
      //leaveAnimation,
      swipeToClose: true,
      mode: 'ios'
    });
    return await modal.present();
  }
}
