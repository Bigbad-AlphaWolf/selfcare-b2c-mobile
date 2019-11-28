import { Component, OnInit } from "@angular/core";
import { SargalService } from "../services/sargal-service/sargal.service";
import { SargalStatusModel } from "src/shared";
import { Router } from "@angular/router";
import { DashboardService } from "../services/dashboard-service/dashboard.service";
import * as SecureLS from "secure-ls";
const ls = new SecureLS({ encodingType: "aes" });

@Component({
  selector: "app-sargal-status-card",
  templateUrl: "./sargal-status-card.page.html",
  styleUrls: ["./sargal-status-card.page.scss"]
})
export class SargalStatusCardPage implements OnInit {
  sargalStatus: string;
  loadingStatus: boolean;
  hasError: boolean;
  title = "Ma carte ";
  expiredStatus: boolean;
  currentNumber: string;
  name: string;

  constructor(
    private sargalService: SargalService,
    private router: Router,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.getCustomerSargalStatus();
    this.currentNumber = this.dashboardService.getCurrentPhoneNumber();
    const user = ls.get("user");
    this.name = user.firstName + " " + user.lastName;
  }

  getCustomerSargalStatus() {
    this.loadingStatus = true;
    this.hasError = false;
    this.expiredStatus = false;
    this.sargalService.getCustomerSargalStatus().subscribe(
      (sargalStatus: SargalStatusModel) => {
        if (sargalStatus.valid) {
          this.sargalStatus = sargalStatus.status;
          this.title += sargalStatus.status;
        } else {
          this.expiredStatus = true;
        }
        this.loadingStatus = false;
      },
      (err: any) => {
        this.loadingStatus = false;
        if (err.status && err.status === 400) {
          this.router.navigate(["/dashboard"]);
        } else {
          this.hasError = true;
        }
      }
    );
  }

  goBack() {
    this.router.navigate(["/sargal-dashboard"]);
  }
}
