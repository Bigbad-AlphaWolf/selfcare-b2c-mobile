import { Component, Input, OnInit } from "@angular/core";
import { KioskOMModel } from "src/app/models/kiosk-om.model";

@Component({
  selector: "app-kiosk-card",
  templateUrl: "./kiosk-card.component.html",
  styleUrls: ["./kiosk-card.component.scss"],
})
export class KioskCardComponent implements OnInit {
  @Input() kiosk: KioskOMModel;
  @Input() index: number;
  constructor() {}

  ngOnInit() {}
}
