import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../services/dashboard-service/dashboard.service';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { REGEX_NUMBER, REGEX_FIX_NUMBER } from 'src/shared';

@Component({
  selector: 'app-add-new-phone-number',
  templateUrl: './add-new-phone-number.page.html',
  styleUrls: ['./add-new-phone-number.page.scss'],
})
export class AddNewPhoneNumberPage implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') myScrollContainer: ElementRef;
    CHOOSE_LINE_STEP = 'CHOOSE_LINE';
    CHOOSE_IDEN_OR_BILL_STEP = 'CHOOSE_IDEN_OR_BILL';
    CHOOSE_PASS_OR_CARD_STEP = 'CHOOSE_PASS_OR_CARD';
    messages = [];
    newNumber = '';
    currentStep = '';
    stepInputType = '';
    inputValue = '';
    welcome = true;
    lineType = '';
    verificationSheet = '';
    identitySheet = '';
    handToUser: boolean;
    msisdnLogin;
    public action = 'register';
    public token?: string;

    constructor(
        private router: Router,
        private dashboardServ: DashboardService,
        private authServ: AuthenticationService,
        private reCaptchaV3Service: ReCaptchaV3Service
    ) {}

    ngOnInit() {
        this.msisdnLogin = this.authServ.getUserMainPhoneNumber();
    }

    ngAfterViewChecked() {
        this.scrollBottom();
    }

    scrollBottom() {
        try {
            if (this.myScrollContainer) {
                this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
            }
        } catch (err) {}
    }

    userSendMessage(message: { type: string; content: string; editable: boolean; step: string; editType: string }) {
        const msg = Object.assign({}, message, { origin: 'sent' });
        this.messages.push(msg);
    }

    ibouSendMessage(content: string, title?: string) {
        this.handToUser = false;
        const ibouMessage = {
            type: 'text',
            content,
            origin: 'received',
            editable: false,
            title
        };
        const loaderMessage = { type: 'loading', origin: 'received' };
        setTimeout(() => {
            this.messages.push(loaderMessage);
        }, 500);
        setTimeout(() => {
            this.messages.pop();
            this.messages.push(ibouMessage);
            this.handToUser = true;
        }, 2000);
    }

    startChat() {
        this.welcome = false;
        this.goStepChooseLine();
    }

    goStepChooseLine() {
        this.currentStep = 'CHOOSE_LINE';
        setTimeout(() => {
            this.messages.push({ type: 'lineChoice' });
        }, 3000);
        this.ibouSendMessage(
            'Je suis Ibou votre conseiller. Je vais vous aider à rattacher une nouvelle ligne. Choisissez le type de ligne à rattacher'
        );
    }

    onChooseLine(line: any) {
        if (this.currentStep === 'CHOOSE_LINE') {
            this.lineType = line.name;
            const userMsg = {
                type: 'text',
                content: line.name,
                editable: true,
                step: this.currentStep,
                editType: 'text'
            };
            this.userSendMessage(userMsg);
            this.goStepWriteNumber();
            const infos = { type: this.lineType, login: this.msisdnLogin };
        }
    }

    goStepWriteNumber() {
        this.currentStep = 'NUMBER';
        this.ibouSendMessage(`Entrez le numéro de téléphone ${this.lineType}`);
    }

    // For mobile rattachment

    goStepValidationCode() {
        this.currentStep = 'VALIDATION_CODE';
        this.ibouSendMessage('Vous allez recevoir un code à 6 chiffres par SMS dans quelques secondes.');
        this.inputValue = '';
    }

    goStepAlreadyUsedNumber() {
        this.ibouSendMessage('Veuillez saisir un autre numéro', 'Ce numéro est déjà rattaché à un compte');
    }

    goStepWrongCode() {
        this.ibouSendMessage('Le code que vous avez saisi est incorrect');
    }

    goStepSuccess() {
        this.currentStep = 'SUCCESS';
    }

    goStepFailed() {
        this.currentStep = 'FAILED';
    }

    userSendMobileNumber(phoneNumber: string) {
        const userMsg = {
            type: 'text',
            content: phoneNumber,
            editable: true,
            step: this.currentStep,
            editType: 'text'
        };
        this.userSendMessage(userMsg);
        this.ValidateMobileNumber(phoneNumber);
        this.inputValue = '';
    }

    sendOTPCode(msisdn: string) {
        // todo captcha
        /* this.reCaptchaV3Service.execute(captchaSiteKey, this.action, tokenResp => {
            this.authServ.generateUserOtp(msisdn, tokenResp).subscribe(
                (res: any) => {
                    this.newNumber = msisdn;
                    this.goStepValidationCode();
                },
                (err: any) => {
                    if (err.status === 504) {
                        this.newNumber = msisdn;
                        this.goStepValidationCode();
                    } else {
                        this.ibouSendMessage('Oups!!! Une erreur est survenue, veuillez réessayer plus tard. Merci');
                    }
                }
            );
        }); */
    }

    ValidateMobileNumber(msisdnRattache: string) {
        /* if (REGEX_NUMBER.test(msisdnRattache)) {
            this.reCaptchaV3Service.execute(
                captchaSiteKey,
                this.action,
                tokenResp => {
                    this.authServ.checkUserStatus(msisdnRattache, tokenResp).subscribe(
                        (res: any) => {
                            // Send OTP CODE if MSG sent goToNextStep() else show msg from endpoint
                            this.sendOTPCode(msisdnRattache);
                        },
                        (err: any) => {
                            const infosFollow = { number_to_attach: msisdnRattache, login: this.msisdnLogin, error: err.error.title };
                            this.ibouSendMessage(err.error.title);
                        }
                    );
                },
                {
                    useGlobalDomain: false
                }
            );
        } else {
            const infosFollow = { number_to_attach: msisdnRattache, login: this.msisdnLogin, error: 'Numéro invalide' };
            this.ibouSendMessage('Veuillez saisir un numéro mobile correct', `Ce numéro n'est pas valide`);
        } */
    }

    userSendValidationCode(code: string) {
        const userMsg = {
            type: 'text',
            content: code,
            editable: false,
            step: this.currentStep,
            editType: 'text'
        };
        this.userSendMessage(userMsg);
        this.inputValue = '';
        const msisdn = this.newNumber;
        this.authServ.checkOtp({ msisdn, code }).subscribe(
            (res: any) => {
                const infosFollow = { number_to_attach: this.newNumber, login: this.msisdnLogin };
                if (res.valid) {
                    this.saveRattachmentNumber(msisdn, 'MOBILE');
                } else {
                    this.ibouSendMessage(`Ce code n'est pas valide`);
                }
            },
            (err: any) => {
                this.ibouSendMessage(err.error.title);
            }
        );
    }

    saveRattachmentNumber(msisdn: string, typeRattachement: 'MOBILE' | 'FIX') {
        this.dashboardServ.registerNumberToAttach({ login: this.msisdnLogin, numero: msisdn, typeNumero: typeRattachement }).subscribe(
            (res: any) => {
                this.followAttachmentIssues('mobile', 'EVENT');
                this.goStepSuccess();
            },
            (err: any) => {
                this.followAttachmentIssues('mobile', 'ERROR');
                this.goStepFailed();
            }
        );
    }

    onEditValue(message: any) {
        this.currentStep = message.step;
        switch (this.currentStep) {
            case 'CHOOSE_LINE':
                this.goStepChooseLine();
                break;
            case 'NUMBER':
                this.goStepWriteNumber();
                break;
        }
    }

    sendMobile() {
        switch (this.currentStep) {
            case 'NUMBER':
                this.userSendMobileNumber(this.inputValue);
                break;
            case 'VALIDATION_CODE':
                this.userSendValidationCode(this.inputValue);
                break;
        }
    }

    // For fix rattachement

    userSendFixeNumber(phoneNumber: string) {
        const userMsg = {
            type: 'text',
            content: phoneNumber,
            editable: true,
            step: this.currentStep,
            editType: 'text'
        };
        this.userSendMessage(userMsg);
        this.ValidateHomeNumber(phoneNumber);
        this.inputValue = '';
    }

    ValidateHomeNumber(homeNumber: string) {
       /*  if (REGEX_FIX_NUMBER.test(homeNumber)) {
            this.reCaptchaV3Service.execute(
                captchaSiteKey,
                this.action,
                tokenResp => {
                    this.dashboardServ.checkFixNumber({ login: this.msisdnLogin, msisdn: homeNumber, token: tokenResp }).subscribe(
                        (res: any) => {
                            this.newNumber = homeNumber;
                            this.goStepClientId();
                        },
                        (err: any) => {
                            const infosFollow = { number_to_attach: homeNumber, login: this.msisdnLogin, error: err.error.title };
                            this.ibouSendMessage(err.error.title);
                        }
                    );
                },
                {
                    useGlobalDomain: false
                }
            );
        } else {
            const infosFollow = { number_to_attach: homeNumber, login: this.msisdnLogin, error: 'Numéro fixe invalide' };
            this.ibouSendMessage('Veuillez saisir un numéro fixe correct', `Ce numéro n'est pas valide`);
        } */
    }

    goStepClientId() {
        this.currentStep = 'CLIENT_ID';
        this.ibouSendMessage('Entrez votre numéro de compte client');
        setTimeout(() => {
            this.ibouSendMessage('Votre numéro de compte client se trouve en haut à gauche sur toutes vos factures fixes');
        }, 2100);
        this.inputValue = '';
    }

    userSendClientId(clientId) {
        const userMsg = {
            type: 'text',
            content: clientId,
            editable: false,
            step: this.currentStep,
            editType: 'text'
        };
        this.userSendMessage(userMsg);
        this.inputValue = '';
        this.dashboardServ.attachFixNumber({ login: this.msisdnLogin, idClient: clientId, numero: this.newNumber }).subscribe(
            () => {
                this.followAttachmentIssues('fixe', 'EVENT');
                this.goStepSuccess();
            },
            (err: any) => {
                this.followAttachmentIssues('fixe', 'ERROR');
                if (err.status === 404 || err.status === 400) {
                    this.ibouSendMessage(`Le numéro de compte client saisi est incorrect. Veuillez le ressaisir.`);
                } else {
                    this.goStepFailed();
                }
            }
        );
    }

    followAttachmentIssues(numberType: string, eventType: string) {
        if (eventType === 'EVENT') {
            const infosFollow = { attached_number: this.newNumber, login: this.msisdnLogin };
            const eventName = `rattachment_${numberType}_success`;
        } else {
            const infosFollow = { number_to_attach: this.newNumber, login: this.msisdnLogin };
            const errorName = `rattachment_${numberType}_failed`;
        }
    }

    sendFixe() {
        switch (this.currentStep) {
            case 'NUMBER':
                this.userSendFixeNumber(this.inputValue);
                break;
            case 'CLIENT_ID':
                this.userSendClientId(this.inputValue);
                break;
        }
    }

    send() {
        if (this.handToUser) {
            this.inputValue = this.inputValue.trim();
            if (this.lineType === 'mobile') {
                this.sendMobile();
            } else {
                this.sendFixe();
            }
        }
    }

    goBack() {
        this.router.navigate(['/change-main-phone-number']);
    }

    goBackHome() {
        this.router.navigate(['/dashboard']);
    }

}
