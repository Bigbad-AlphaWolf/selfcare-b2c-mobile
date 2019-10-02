import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help-item',
  templateUrl: './help-item.component.html',
  styleUrls: ['./help-item.component.scss']
})
export class HelpItemComponent implements OnInit {
  @Input() text;
  @Input() imgName;

  constructor() {}

  ngOnInit() {}
}
