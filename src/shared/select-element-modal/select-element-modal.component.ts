import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-select-element-modal',
  templateUrl: './select-element-modal.component.html',
  styleUrls: ['./select-element-modal.component.scss'],
})
export class SelectElementModalComponent implements OnInit {
  @Input() items: any[];
  @Input() title: string = 'Choisir une raison';
  @Input() selectedItem: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  closeModal(withItem?) {
    this.modalController.dismiss(withItem);
  }

  selectItem(item) {
    this.selectedItem = item;
  }
}
