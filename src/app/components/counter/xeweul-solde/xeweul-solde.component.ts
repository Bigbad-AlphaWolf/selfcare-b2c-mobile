import {Component, OnInit, Input} from '@angular/core';
import {OperationExtras} from 'src/app/models/operation-extras.model';
import {XeweulService} from 'src/app/services/xeweul/xeweul.service';
import {tap, catchError} from 'rxjs/operators';
import {NavController, ModalController} from '@ionic/angular';
import {BillAmountPage} from 'src/app/pages/bill-amount/bill-amount.page';
import {OPERATION_XEWEUL} from 'src/app/utils/operations.constants';
import {IXeweulCard} from "../../../models/xeweul/card.model";
import {HttpResponse} from "@angular/common/http";
import {IXeweulBalance} from "../../../models/xeweul/xeweul-balance.model";

@Component({
    selector: 'app-xeweul-solde',
    templateUrl: './xeweul-solde.component.html',
    styleUrls: ['./xeweul-solde.component.scss'],
})
export class XeweulSoldeComponent implements OnInit {
    @Input() counter: IXeweulCard;
    @Input() opXtras: OperationExtras;
    infoSolde: string;
    lastSoldeUpdate: string;
    isLoading: boolean;

    constructor(private xeweulService: XeweulService, private navCtl: NavController, private modal: ModalController) {
    }

    ngOnInit() {
        if (this.counter) {
            this.getSolde2(this.counter.id);
            // this.getSolde(this.counter.counterNumber);
        }
    }

    getSolde(counter: string) {
        this.isLoading = true;
        this.xeweulService
            .getSolde(counter)
            .pipe(
                tap((res: any) => {
                    this.isLoading = false;
                    const data = res.content.data;
                    if (data) {
                        this.infoSolde = data.solde;
                        this.lastSoldeUpdate = data.date_solde;
                    }
                }),
                catchError((err: any) => {
                    this.isLoading = false;
                    return err;
                })
            )
            .subscribe();
    }

    getSolde2(counter: string) {
        this.isLoading = true;
        this.xeweulService
            .getSolde(counter)
            .subscribe({

                error: () => {
                    this.isLoading = false;
                },

                next: (res: HttpResponse<IXeweulBalance>) => {
                    this.isLoading = false;

                    this.infoSolde = res.body.amount;
                    this.lastSoldeUpdate = res.body.lastUpdatedAt;

                }

            });
    }

    onRecharge() {
        const routePath = BillAmountPage.ROUTE_PATH;
        this.opXtras.purchaseType = OPERATION_XEWEUL;
        this.opXtras.billData ? (this.opXtras.billData.counter.counterNumber = this.counter.id) : '';
        this.modal.dismiss();
        this.navCtl.navigateForward([routePath], {
            state: this.opXtras,
        });
    }
}
