import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() title: string;
  @Output() goBack = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  previousStep() {
    this.goBack.emit();
  }
}
