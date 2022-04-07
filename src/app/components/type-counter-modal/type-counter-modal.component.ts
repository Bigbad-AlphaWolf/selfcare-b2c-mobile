import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ModalController } from "@ionic/angular";
import { catchError, map, tap } from "rxjs/operators";
import { FavorisOem } from "src/app/models/favoris-oem.model";
import { BillsService } from "src/app/services/bill-service/bills.service";
import { BottomSheetService } from "src/app/services/bottom-sheet/bottom-sheet.service";
import { FavorisService } from "src/app/services/favoris/favoris.service";
import {
  OPERATION_TYPE_SENEAU_BILLS,
  OPERATION_TYPE_SENELEC_BILLS,
} from "src/app/utils/operations.constants";
import { FavoriteServiceCountersComponent } from "../counter/favorite-service-counters/favorite-service-counters.component";

@Component({
  selector: "app-type-counter-modal",
  templateUrl: "./type-counter-modal.component.html",
  styleUrls: ["./type-counter-modal.component.scss"],
})
export class TypeCounterModalComponent implements OnInit {
  OPERATION_TYPE_SENELEC_BILLS = OPERATION_TYPE_SENELEC_BILLS;
  OPERATION_TYPE_SENEAU_BILLS = OPERATION_TYPE_SENEAU_BILLS;
  form: FormGroup;
  hasError: boolean;
  checking: boolean;
  errorMessage: string;
  counter: number;
  @Input() operation: string;

  constructor(
    private fb: FormBuilder,
    private bsService: BottomSheetService,
    private modalController: ModalController,
    private router: Router,
    private favorisService: FavorisService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      counter: ["", [Validators.required]],
    });
  }

  async openFavorites(event: MouseEvent) {
    event.stopPropagation();
    this.modalController.dismiss();
    this.bsService.openModal(FavoriteServiceCountersComponent, {
      operationType: this.operation,
    });
  }

  checkCounter() {
    this.checking = true;
    let counterToRattach;
    const counter = this.form.value.counter;
    const service = this.favorisService.getFavoriteCode(this.operation);
    this.favorisService.favoritesByService(service).pipe(
      tap((favoris: FavorisOem[]) => {
        const res = favoris.map(fav => fav.ref_num);
        if (!res.includes(counter)) {
          counterToRattach = true;
          console.log(counterToRattach);
        }
        this.checking = false;
        this.modalController.dismiss();
        this.router.navigate(["/bills"], {
          state: {
            ligne: counter,
            nomLigne: "",
            type: this.operation,
            operationType: this.operation,
            counterToRattach,
          },
        });
      }),
      catchError(err => {
        this.checking = false;
        throw new Error(err);
      })
    ).subscribe();
    
  }
}
