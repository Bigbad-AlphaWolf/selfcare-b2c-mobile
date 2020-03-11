import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { DashboardService } from "src/app/services/dashboard-service/dashboard.service";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Subscription } from "rxjs";
import {
  OPERATION_TYPE_PASS_INTERNET,
  OPERATION_TYPE_PASS_ILLIMIX,
  OPERATION_TYPE_SOS,
  OPERATION_TYPE_SEDDO_CREDIT,
  OPERATION_TYPE_SEDDO_PASS,
  OPERATION_TYPE_SEDDO_BONUS,
  OPERATION_TYPE_TRANSFER_OM,
  PAY_WITH_CREDIT,
  PAY_WITH_OM,
  PAY_WITH_BONUS,
  PAY_ON_NEXT_RECHARGE,
  PAYMENT_MOD_CREDIT,
  PAYMENT_MOD_OM,
  PAYMENT_MOD_BONUS,
  PAYMENT_MOD_NEXT_RECHARGE,
  OPERATION_TYPE_RECHARGE_CREDIT,
  OPERATION_TYPE_SOS_CREDIT,
  OPERATION_TYPE_SOS_PASS,
  REGEX_NUMBER,
  OPERATION_TYPE_SARGAL_CONVERSION,
  PAYMENT_MOD_SARGAL,
  PAY_WITH_SARGAL,
  formatPhoneNumber
} from "..";
import { CancelOperationPopupComponent } from "../cancel-operation-popup/cancel-operation-popup.component";
import { SoSModel } from "src/app/services/sos-service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { OrangeMoneyService } from "src/app/services/orange-money-service/orange-money.service";
import {
  FeeModel,
  ORANGE_MONEY_TRANSFER_FEES
} from "src/app/services/orange-money-service";
import { Contacts, Contact } from "@ionic-native/contacts";
import { validateNumber } from "src/app/register";
import { SelectNumberPopupComponent } from "../select-number-popup/select-number-popup.component";

@Component({
  selector: "app-operation-validation",
  templateUrl: "./operation-validation.component.html",
  styleUrls: ["./operation-validation.component.scss"]
})
export class OperationValidationComponent implements OnInit, OnDestroy {
  dialogRef: MatDialogRef<CancelOperationPopupComponent, any>;
  dialogSub: Subscription;

  @Input() operationType: string;
  @Input() buyForMe: boolean;
  @Input() paymentMod: string;
  @Input() recipient: string;
  @Input() sosChosen: SoSModel;
  @Input() loading: boolean;
  @Input() passIntChosen: any; // PassInfoModel | PromoPassModel;
  @Input() passIllChosen: any; // PassIllimModel | PromoPassIllimModel;
  @Input() rechargeCreditAmount: number;
  @Input() amountToTransfer: number;
  @Input() omRecipientFirstName: string = "";
  @Input() omRecipientLastName: string = "";
  @Input() recipientHasOmAccount: boolean;
  @Input() sargalGift: any; // GiftSargalItem;
  @Input() kirene: boolean;
  @Output() validate = new EventEmitter();

  OPERATION_TYPE_PASS_INTERNET = OPERATION_TYPE_PASS_INTERNET;
  OPERATION_TYPE_PASS_ILLIMIX = OPERATION_TYPE_PASS_ILLIMIX;
  OPERATION_TYPE_RECHARGE_CREDIT = OPERATION_TYPE_RECHARGE_CREDIT;
  OPERATION_TYPE_SOS = OPERATION_TYPE_SOS;
  OPERATION_TYPE_SEDDO_CREDIT = OPERATION_TYPE_SEDDO_CREDIT;
  OPERATION_TYPE_SEDDO_PASS = OPERATION_TYPE_SEDDO_PASS;
  OPERATION_TYPE_SEDDO_BONUS = OPERATION_TYPE_SEDDO_BONUS;
  OPERATION_TRANSFER_OM = OPERATION_TYPE_TRANSFER_OM;
  OPERATION_TYPE_SOS_PASS = OPERATION_TYPE_SOS_PASS;
  OPERATION_TYPE_SOS_CREDIT = OPERATION_TYPE_SOS_CREDIT;
  OPERATION_TYPE_SARGAL_CONVERSION = OPERATION_TYPE_SARGAL_CONVERSION;
  PAY_WITH_CREDIT = PAY_WITH_CREDIT;
  PAY_WITH_OM = PAY_WITH_OM;
  PAY_WITH_BONUS = PAY_WITH_BONUS;
  PAY_ON_NEXT_RECHARGE = PAY_ON_NEXT_RECHARGE;
  userNumber = this.dashServ.getCurrentPhoneNumber();

  PAYMENT_MOD_CREDIT = PAYMENT_MOD_CREDIT;
  PAYMENT_MOD_OM = PAYMENT_MOD_OM;
  PAYMENT_MOD_BONUS = PAYMENT_MOD_BONUS;
  PAYMENT_MOD_NEXT_RECHARGE = PAYMENT_MOD_NEXT_RECHARGE;
  PAYMENT_MOD_SARGAL = PAYMENT_MOD_SARGAL;
  total;
  payBuyOm = false;
  fees = 0;
  feeWithCode: number;
  feeWithoutCode: number;
  transferWithCode = false;
  feesOnMyCharge = false;
  form: FormGroup;
  formNumeroIllimite: FormGroup;
  showErrorMsg1: boolean;
  showErrorMsg2: boolean;

  constructor(
    private fb: FormBuilder,
    private dashServ: DashboardService,
    public dialog: MatDialog,
    private contacts: Contacts,
    private omService: OrangeMoneyService
  ) {}

  ngOnInit() {
    if (this.operationType === OPERATION_TYPE_TRANSFER_OM) {
      this.form = this.fb.group({
        nom: [
          this.omRecipientLastName,
          [Validators.required, Validators.minLength(2)]
        ],
        prenom: [
          this.omRecipientFirstName,
          [Validators.required]
        ]
      });
      this.getFees();
      if (!this.recipientHasOmAccount) {
        this.transferWithCode = true;
        this.feesOnMyCharge = true;
      }
    }
    if (this.sargalGift) {
      if (this.sargalGift.nombreNumeroIllimtes > 1) {
        this.formNumeroIllimite = this.fb.group({
          illimite1: [
            "",
            [Validators.required, Validators.pattern(REGEX_NUMBER)]
          ],
          illimite2: [
            "",
            [Validators.required, Validators.pattern(REGEX_NUMBER)]
          ]
        });
      } else if (this.sargalGift.nombreNumeroIllimtes === 1) {
        this.formNumeroIllimite = this.fb.group({
          illimite1: [
            "",
            [Validators.required, Validators.pattern(REGEX_NUMBER)]
          ]
        });
      }
    }
  }

  getFees() {
    this.omService.getTransferFees().subscribe(
      (fees: FeeModel[]) => {
        this.extractOMfees(fees);
      },
      err => {
        const fees = ORANGE_MONEY_TRANSFER_FEES;
        this.extractOMfees(fees);
      }
    );
  }

  extractOMfees(fees: FeeModel[]) {
    for (let i = 0; i < fees.length; i++) {
      if (
        this.amountToTransfer <= fees[i].maximum &&
        this.amountToTransfer >= fees[i].minimum
      ) {
        this.feeWithCode = fees[i].withCode;
        this.feeWithoutCode = fees[i].withoutCode;
        break;
      }
    }
  }

  openConfirmationDialog() {
    this.dialogRef = this.dialog.open(CancelOperationPopupComponent, {
      width: "294px",
      height: "232px"
    });
    this.dialogSub = this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const msg = this.formatFollowMsg(this.operationType);
        // if (msg) {
        //   FollowAnalytics.logEvent(msg, 'clicked');
        // }
      }
    });
  }

  formatFollowMsg(typeOperation: string): string {
    switch (typeOperation) {
      case OPERATION_TYPE_PASS_INTERNET:
        return "Buy_Pass_Internet_Cancel_confirmation";
      case OPERATION_TYPE_RECHARGE_CREDIT:
        return "Recharge_OM_Cancel_confirmation";
      case OPERATION_TYPE_SOS:
        return "Sos_Cancel_confirmation";
      case OPERATION_TYPE_SOS_CREDIT:
        return "Sos_Credit_Cancel_confirmation";
      case OPERATION_TYPE_SEDDO_CREDIT:
        return "Seddo_Credit_Cancel_confirmation";
      case OPERATION_TYPE_SEDDO_PASS:
        return "Seddo_Pass_Cancel_confirmation";
      case OPERATION_TYPE_SEDDO_BONUS:
        return "Seddo_Bonus_Cancel_confirmation";
      default:
        break;
    }
  }

  validateOperation() {
    if (this.operationType === OPERATION_TYPE_TRANSFER_OM) {
      const omTransferInfos = {
        fees: this.fees,
        firstName: this.form.value.prenom,
        lastName: this.form.value.nom,
        transferWithCode: this.transferWithCode,
        feesOnMyCharge: this.feesOnMyCharge,
        amountToTransfer: this.amountToTransfer
      };
      this.validate.emit(omTransferInfos);
    } else if (
      this.operationType === OPERATION_TYPE_SARGAL_CONVERSION &&
      this.sargalGift.nombreNumeroIllimtes
    ) {
      const numeroIllimiteArray = [];
      const num1 = this.formNumeroIllimite.value.illimite1;
      numeroIllimiteArray.push(num1);
      if (this.sargalGift.nombreNumeroIllimtes > 1) {
        const num2 = this.formNumeroIllimite.value.illimite2;
        numeroIllimiteArray.push(num2);
      }
      this.validate.emit(numeroIllimiteArray);
    } else {
      this.validate.emit();
    }
  }

  toggleTransferWithCode(event) {
    this.transferWithCode = event.checked;
    if (this.transferWithCode) {
      this.feesOnMyCharge = true;
      this.fees = this.feeWithCode;
    } else {
      this.feesOnMyCharge = false;
      this.fees = 0;
    }
  }

  toggleFees(event) {
    this.feesOnMyCharge = event.checked;
    if (this.feesOnMyCharge) {
      this.fees = this.feeWithoutCode;
    } else {
      this.fees = 0;
    }
  }

  getPaymentModLabel(paymentMod: string) {
    switch (paymentMod) {
      case PAYMENT_MOD_CREDIT:
        return PAY_WITH_CREDIT;
      case PAYMENT_MOD_BONUS:
        return PAY_WITH_BONUS;
      case PAYMENT_MOD_OM:
        return PAY_WITH_OM;
      case PAYMENT_MOD_NEXT_RECHARGE:
        return PAY_ON_NEXT_RECHARGE;
      case PAYMENT_MOD_SARGAL:
        return PAY_WITH_SARGAL;
    }
  }

  getPassValidityText(pass: any) {
    const category = pass.passPromo
      ? pass.passPromo.categoriePass.libelle
      : pass.categoriePass.libelle;
    switch (category) {
      case "Jour":
        return "Valable 24 heures";
      case "3 Jours":
        return "Valable 3 jours";
      case "Semaine":
        return "Valable 7 jours";
      case "Mois":
        return "Valable 1 mois";
      default:
        return "";
    }
  }

  pickContact(numeroChampIllimite: number) {
    // const testContacts = [{ value: '77 133 12 25' }, { value: '77 133 12 26' }];
    // this.openPickRecipientModal(testContacts);
    numeroChampIllimite === 1
      ? (this.showErrorMsg1 = false)
      : (this.showErrorMsg2 = false);
    this.contacts
      .pickContact()
      .then((contact: Contact) => {
        if (contact.phoneNumbers.length > 1) {
          this.openPickRecipientModal(
            contact.phoneNumbers,
            numeroChampIllimite
          );
        } else {
          const number = formatPhoneNumber(contact.phoneNumbers[0].value);
          this.fillNumeroIllimiteForm(numeroChampIllimite, number);
        }
      })
      .catch(err => {});
  }

  openPickRecipientModal(phoneNumbers: any[], numeroChampIllimite: number) {
    const dialogRef = this.dialog.open(SelectNumberPopupComponent, {
      data: { phoneNumbers }
    });
    dialogRef.afterClosed().subscribe(selectedNumber => {
      const destNumber = formatPhoneNumber(selectedNumber);
      this.fillNumeroIllimiteForm(numeroChampIllimite, destNumber);
    });
  }

  fillNumeroIllimiteForm(numeroChampIllimite: number, phoneNumber: string) {
    if (validateNumber(phoneNumber)) {
      if (
        numeroChampIllimite === 1 &&
        this.sargalGift.nombreNumeroIllimtes === 1
      ) {
        this.formNumeroIllimite.setValue({ illimite1: phoneNumber });
      } else if (
        numeroChampIllimite === 1 &&
        this.sargalGift.nombreNumeroIllimtes > 2
      ) {
        const number2 = this.formNumeroIllimite.value.illimite2;
        this.formNumeroIllimite.setValue({
          illimite1: phoneNumber,
          illimite2: number2
        });
      } else {
        const number1 = this.formNumeroIllimite.value.illimite1;
        this.formNumeroIllimite.setValue({
          illimite1: number1,
          illimite2: phoneNumber
        });
      }
    } else {
      numeroChampIllimite === 1
        ? (this.showErrorMsg1 = true)
        : (this.showErrorMsg2 = true);
    }
  }

  ngOnDestroy() {
    if (this.dialogSub) {
      this.dialogSub.unsubscribe();
    }
  }
}
