import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  SimpleChanges,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication-service/authentication.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { ReCaptchaV3Service } from 'ngx-captcha';
import {
  registrationSteps,
  validateNumber,
  captchaSiteKey,
  userFriendlyTime,
  isOTPValid,
  validateName,
  validateEmail,
  validatePassword
} from '.';
import { CguPopupComponent } from './cgu-popup/cgu-popup.component';
import * as SecureLS from 'secure-ls';
const ls = new SecureLS({ encodingType: 'aes' });

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit, OnDestroy, OnChanges {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('formInput') private input: ElementRef;
  public messages = [];
  inputValue = '';
  stepInputType = 'text';
  showResendCode = false;
  currentStep = '';
  login = '';
  password = '';
  firstName = '';
  lastName = '';
  email = '';
  audioDisabled = true;
  currentAudio = '';
  audioStep = '';
  audio = new Audio();
  yesNoAnswer = false;
  ibouIsTalking = false;
  ibouIsWriting = false;
  handToUser = false;
  newUser: any;
  visibilityIcon = 'visibility';
  generateOTPSubscription: Subscription;
  checkOTPSubscription: Subscription;
  getAbonneInfosSubscription: Subscription;
  checkEmailSubscription: Subscription;
  registrationSubscription: Subscription;
  checkNumberSubscription: Subscription;
  public action = 'register';
  public token?: string;
  public recaptchaScore = 0;

  constructor(
    private router: Router,
    private authServ: AuthenticationService,
    private reCaptchaV3Service: ReCaptchaV3Service,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.authServ.scrollToBottomEvent.subscribe(() => {
      this.scrollBottom();
    });
    this.welcomeUser();
    this.audio.addEventListener('loadeddata', () => {
      this.onCanPlay();
    });
    this.audio.addEventListener('play', () => {
      this.ibouIsTalking = true;
    });
    this.audio.addEventListener('ended', () => {
      this.ibouIsTalking = false;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentStepInputType) {
      this.stepInputType = changes.currentStepInputType.currentValue;
    }
  }

  scrollBottom() {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      // call log service
    }
  }

  focusInput(event) {
    if (event) {
      this.input.nativeElement.focus();
    }
  }

  onCanPlay() {
    this.audio.play();
  }

  muteOrUnmute() {
    this.audioDisabled = !this.audioDisabled;
    if (!this.audioDisabled) {
      this.ibouTalk(this.audioStep);
    } else {
      this.audio.pause();
      this.ibouIsTalking = false;
    }
  }

  loadAudio(name: string) {
    this.audio.src = `/content/audios/${name}.mp3`;
    this.audio.load();
  }

  getAudioName(step: string) {
    return registrationSteps[step].stepAudio;
  }

  ibouTalk(step: string) {
    this.audioStep = step;
    if (!this.audioDisabled) {
      const audioName = this.getAudioName(step);
      if (audioName) {
        this.loadAudio(audioName);
      }
    }
  }

  userSendMessage(message: any) {
    const msg = Object.assign({}, message, { origin: 'sent' });
    this.messages.push(msg);
    this.handToUser = false;
    setTimeout(() => {
      this.authServ.scrollChatBox();
    }, 300);
  }

  showLoaderMessage() {
    const loaderMessage = { type: 'loading', origin: 'received' };
    this.messages.push(loaderMessage);
    setTimeout(() => {
      this.authServ.scrollChatBox();
    }, 50);
  }

  removeLoaderMessage() {
    const loaderMsg = this.messages.find(x => x.type === 'loading');
    if (loaderMsg) {
      this.messages.splice(this.messages.indexOf(loaderMsg), 1);
    }
  }

  ibouSendMessage(
    content: string,
    title?: string,
    showAvatar?: boolean,
    inputFocus?: boolean
  ) {
    this.ibouIsWriting = true;
    const ibouMessage = {
      type: 'text',
      content,
      origin: 'received',
      editable: false,
      title,
      showAvatar,
      inputFocus
    };
    this.showLoaderMessage();
    setTimeout(() => {
      this.removeLoaderMessage();
      this.messages.push(ibouMessage);
      setTimeout(() => {
        this.authServ.scrollChatBox();
        this.ibouIsWriting = false;
        this.handToUser = true;
      }, 50);
    }, 300);
  }

  updateStepInputType() {
    this.stepInputType = registrationSteps[this.currentStep].stepInput;
  }

  ibouAskQuestion(question: string) {
    this.ibouSendMessage(question);
    setTimeout(() => {
      const questionMessage = { type: 'question', editable: true };
      this.messages.push(questionMessage);
      this.handToUser = false;
      setTimeout(() => {
        this.authServ.scrollChatBox();
      }, 50);
    }, 300);
  }

  showBtnResetCode() {
    const resendBtn = { type: 'button' };
    this.messages.push(resendBtn);
    setTimeout(() => {
      this.authServ.scrollChatBox();
    }, 50);
    this.showResendCode = true;
  }

  hideBtnResetCode() {
    const resendBtn = this.messages.find(x => x.type === 'button');
    if (resendBtn) {
      this.messages.splice(this.messages.indexOf(resendBtn), 1);
    }
  }

  resendCode() {
    this.checkNumberStatus(this.login);
    this.hideBtnResetCode();
  }

  welcomeUser() {
    this.currentStep = 'PHONE_NUMBER';
    this.ibouTalk('PHONE_NUMBER');
    const title = 'Dalal ak diam !';
    this.ibouSendMessage(
      registrationSteps.PHONE_NUMBER.messages[0],
      title,
      true
    );
    setTimeout(() => {
      this.ibouSendMessage(
        registrationSteps.PHONE_NUMBER.messages[1],
        undefined,
        undefined,
        true
      );
    }, 300);
  }

  userSendPhoneNumber(phoneNumber: string) {
    phoneNumber = phoneNumber.replace(/\s/g, '');
    const phoneNumberMessage = {
      type: 'text',
      content: phoneNumber,
      editable: true,
      audioStep: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(phoneNumberMessage);
    if (validateNumber(phoneNumber)) {
      this.login = phoneNumber;
      this.checkNumberStatus(phoneNumber);
    } else {
      this.ibouTalk('WRONG_PHONE_NUMBER');
      this.ibouSendMessage(
        'Veuillez saisir un numéro valide',
        undefined,
        undefined,
        true
      );
    }
  }

  checkNumberStatus(phoneNumber: string) {
    this.showResendCode = false;
    this.showLoaderMessage();
    // check recaaptcha token
    this.reCaptchaV3Service.execute(
      captchaSiteKey,
      this.action,
      tokenResp => {
        this.token = tokenResp;
        // call backend to check phone number
        this.checkNumberSubscription = this.authServ
          .checkUserStatus(phoneNumber, this.token)
          .subscribe(
            (resp: any) => {
              // ************************** Deuxieme demande de token */
              // check recaaptcha token
              this.reCaptchaV3Service.execute(
                captchaSiteKey,
                this.action,
                token2 => {
                  this.generateOTPSubscription = this.authServ
                    .generateUserOtp(phoneNumber, token2)
                    .subscribe(
                      (res: any) => {
                        this.removeLoaderMessage();
                        this.goStepValidationCode(res.duration);
                      },
                      (err: any) => {
                        if (err.status === 504) {
                          this.removeLoaderMessage();
                          this.goStepValidationCode(120);
                        } else {
                          this.networkErrorHandler(err);
                        }
                      }
                    );
                },
                {
                  useGlobalDomain: false
                }
              );
              // ************************** */
            },
            (err: any) => {
              this.removeLoaderMessage();
              if (err.status === 400) {
                this.goStepAlreadyUsedNumber();
              } else {
                this.networkErrorHandler(err);
              }
            }
          );
      },
      {
        useGlobalDomain: false
      }
    );
  }

  goStepAlreadyUsedNumber() {
    if (this.checkNumberSubscription) {
      this.checkNumberSubscription.unsubscribe();
    }
    if (this.generateOTPSubscription) {
      this.generateOTPSubscription.unsubscribe();
    }
    this.ibouTalk('ALREADY_USED_PHONE_NUMBER');
    this.ibouSendMessage(
      registrationSteps.ALREADY_USED_PHONE_NUMBER.messages[0]
    );
    const hostName = window.location.hostname;
    setTimeout(() => {
      this.ibouSendMessage(
        registrationSteps.ALREADY_USED_PHONE_NUMBER.messages[1],
        `Mot de passe oublié`
      );
      setTimeout(() => {
        const linkMsg = {
          origin: 'received',
          type: 'link',
          link: '/reinitialize-password',
          content: `${hostName}/reinitialize-password`
        };
        this.messages.push(linkMsg);
        setTimeout(() => {
          this.authServ.scrollChatBox();
        }, 50);
      }, 500);
    }, 500);
  }

  // iboutalk() give currenstep as param
  goStepValidationCode(duration: number) {
    if (this.checkNumberSubscription) {
      this.checkNumberSubscription.unsubscribe();
    }
    if (this.generateOTPSubscription) {
      this.generateOTPSubscription.unsubscribe();
    }
    this.currentStep = 'VALIDATION_CODE';
    this.ibouTalk('VALIDATION_CODE');
    this.ibouSendMessage(
      `${registrationSteps.VALIDATION_CODE.messages[0]} ${this.login}`,
      undefined,
      true
    );
    setTimeout(() => {
      this.ibouSendMessage(
        `${registrationSteps.VALIDATION_CODE.messages[1]} ${userFriendlyTime(
          duration
        )}`,
        undefined,
        undefined,
        true
      );
    }, 1200);
    this.updateStepInputType();
    setTimeout(() => {
      if (this.currentStep === 'VALIDATION_CODE' && !this.showResendCode) {
        this.showBtnResetCode();
      }
    }, 35000);
  }

  userSendValidationCode(code) {
    const validationCode = {
      type: 'text',
      content: code,
      editable: false,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(validationCode);
    if (isOTPValid(code)) {
      this.showLoaderMessage();
      this.checkOTPSubscription = this.authServ
        .getInfosAbonneWithOTP(this.login, code)
        .subscribe(
          (resp: any) => {
            this.removeLoaderMessage();
            if (
              resp &&
              resp.nomAbonne &&
              resp.prenomAbonne &&
              (resp.nomAbonne !== 'ND' && resp.prenomAbonne !== 'ND')
            ) {
              const { nomAbonne, prenomAbonne } = resp;
              this.firstName = prenomAbonne;
              this.lastName = nomAbonne;
              this.goStepPassword();
            } else {
              this.goStepFirstName();
            }
          },
          (err: any) => {
            this.removeLoaderMessage();
            if (err.status === 400) {
              this.ibouTalk('WRONG_VALIDATION_CODE');
              this.ibouSendMessage(
                registrationSteps.EXPIRED_VALIDATION_CODE.messages[0]
              );
            } else {
              this.networkErrorHandler(err);
            }
          }
        );
    } else {
      this.goStepWrongCode();
    }
  }

  networkErrorHandler = (err: any) => {
    this.ibouSendMessage(
      `Une erreur s'est produite. Veuillez réessayer ultérieurement`
    );
  }

  goStepWrongCode() {
    if (this.checkOTPSubscription) {
      this.checkOTPSubscription.unsubscribe();
    }
    this.ibouTalk('WRONG_VALIDATION_CODE');
    this.ibouSendMessage(
      registrationSteps.WRONG_VALIDATION_CODE.messages[0],
      undefined,
      undefined,
      true
    );
  }

  goStepFirstName() {
    this.hideBtnResetCode();
    if (this.checkOTPSubscription) {
      this.checkOTPSubscription.unsubscribe();
    }
    if (this.getAbonneInfosSubscription) {
      this.getAbonneInfosSubscription.unsubscribe();
    }
    this.currentStep = 'FIRST_NAME';
    this.ibouTalk('FIRST_NAME');
    this.updateStepInputType();
    this.ibouSendMessage(
      registrationSteps.FIRST_NAME.messages[0],
      undefined,
      true,
      true
    );
  }

  userSendFirstName(firstname: string) {
    const firstName = {
      type: 'text',
      content: firstname,
      editable: true,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(firstName);
    if (validateName(firstname)) {
      this.firstName = firstname;
      this.goStepLastName();
    } else {
      this.goStepWrongName();
    }
  }

  goStepLastName() {
    this.currentStep = 'LAST_NAME';
    this.ibouTalk('LAST_NAME');
    this.updateStepInputType();
    this.ibouSendMessage(
      `${this.firstName} ${registrationSteps.LAST_NAME.messages[0]}`,
      undefined,
      true,
      true
    );
  }

  userSendLastName(lastname: string) {
    const lastName = {
      type: 'text',
      content: lastname,
      editable: true,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(lastName);
    if (validateName(lastname)) {
      this.lastName = lastname;
      this.goStepUserHasMail();
    } else {
      this.goStepWrongName();
    }
  }

  goStepWrongName() {
    this.ibouTalk('WRONG_FIRST_NAME');
    this.ibouSendMessage(registrationSteps.WRONG_FIRST_NAME.messages[0]);
  }

  goStepUserHasMail() {
    this.hideBtnResetCode();
    if (this.checkOTPSubscription) {
      this.checkOTPSubscription.unsubscribe();
    }
    if (this.getAbonneInfosSubscription) {
      this.getAbonneInfosSubscription.unsubscribe();
    }
    this.currentStep = 'USER_HAS_EMAIL';
    this.ibouTalk('USER_HAS_EMAIL');
    this.ibouAskQuestion(registrationSteps.USER_HAS_EMAIL.messages[0]);
  }

  userSendHasEmail(userHasEmail: boolean) {
    if (this.currentStep === 'USER_HAS_EMAIL' || this.currentStep === 'EMAIL') {
      this.yesNoAnswer = userHasEmail;
      if (this.yesNoAnswer) {
        this.goStepEmail();
      } else {
        this.goStepPassword();
      }
    }
  }

  disableMsgYesNo() {
    this.messages.forEach((msg: any, index: number) => {
      if (msg.type === 'question') {
        this.messages[index] = { type: 'question', editable: false };
      }
    });
  }

  goStepEmail() {
    this.currentStep = 'EMAIL';
    this.ibouTalk('EMAIL');
    this.updateStepInputType();
    this.ibouSendMessage(
      registrationSteps.EMAIL.messages[0],
      undefined,
      true,
      true
    );
  }

  userSendEmail(email: string) {
    email = email.replace(/\s/g, '');
    const emailMsg = {
      type: 'text',
      content: email,
      editable: true,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(emailMsg);
    if (validateEmail(email)) {
      this.checkEmailSubscription = this.authServ
        .checkEmailAlreadyUsed(email)
        .subscribe(
          (isAlreadyUsed: any) => {
            if (!isAlreadyUsed) {
              this.email = email;
              this.goStepPassword();
            } else {
              this.ibouSendMessage(
                registrationSteps.ALREADY_USED_EMAIL.messages[0]
              );
              this.ibouTalk('ALREADY_USED_EMAIL');
              setTimeout(() => {
                this.ibouAskQuestion(
                  registrationSteps.USER_HAS_EMAIL.messages[0]
                );
              }, 2600);
            }
          },
          (err: any) => {}
        );
    } else {
      this.ibouTalk('WRONG_EMAIL');
      this.ibouAskQuestion(registrationSteps.WRONG_EMAIL.messages[0]);
    }
  }

  goStepPassword() {
    this.disableMsgYesNo();
    if (this.checkEmailSubscription) {
      this.checkEmailSubscription.unsubscribe();
    }
    this.currentStep = 'PASSWORD';
    this.ibouTalk('PASSWORD');
    this.updateStepInputType();
    this.ibouSendMessage(
      `Merci ${this.lastName} ${this.firstName}. ${
        registrationSteps.PASSWORD.messages[0]
      }`,
      undefined,
      true,
      true
    );
    setTimeout(() => {
      this.ibouSendMessage(
        registrationSteps.PASSWORD.messages[1],
        undefined,
        undefined,
        true
      );
    }, 2600);
  }

  userSendPassword(password) {
    const pwdMsg = {
      type: 'password',
      content: password,
      editable: true,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(pwdMsg);
    if (validatePassword(password)) {
      this.password = password;
      this.goStepConfirmPassword();
    } else {
      this.ibouTalk('WRONG_PASSWORD');
      this.ibouSendMessage(registrationSteps.WRONG_PASSWORD.messages[0]);
    }
  }

  goStepConfirmPassword() {
    this.currentStep = 'PASSWORD_CONFIRM';
    this.visibilityIcon = 'visibility';
    this.ibouTalk('PASSWORD_CONFIRM');
    this.updateStepInputType();
    this.ibouSendMessage(
      registrationSteps.PASSWORD_CONFIRM.messages[0],
      undefined,
      true,
      true
    );
  }

  userSendConfirmPassword(confirmPwd) {
    const pwdConfirm = {
      type: 'password',
      content: confirmPwd,
      editable: false,
      stepAudio: this.audioStep,
      step: this.currentStep
    };
    this.userSendMessage(pwdConfirm);
    if (this.password === confirmPwd) {
      const email = this.email ? this.email : null;
      const userInfos = {
        email,
        firstName: this.firstName,
        lastName: this.lastName,
        login: this.login,
        password: this.password
      };
      this.newUser = userInfos;
      this.openCguDialog();
    } else {
      this.ibouTalk('WRONG_PASSWORD_CONFIRM');
      this.ibouSendMessage(
        registrationSteps.WRONG_PASSWORD_CONFIRM.messages[0]
      );
    }
  }

  openCguDialog() {
    const dialogRef = this.dialog.open(CguPopupComponent, {
      data: { login: this.login }
    });
    dialogRef.afterClosed().subscribe(confirmresult => {
      if (confirmresult) {
        this.goSuccess();
      }
    });
  }

  goSuccess() {
    this.authServ.registerUser(this.newUser).subscribe(
      () => {
        this.currentStep = 'SUCCESS';
        this.messages = [];
        this.ibouTalk('SUCCESS');
        this.messages.push({ type: 'success', origin: 'received' });
        ls.set('subscribedNumber', this.login);
      },
      (err: any) => {
        const { status, error } = err;
        if (status === 400) {
          // bad input
          if (error.fieldErrors) {
            const errorsMsgs = error.fieldErrors.map((x: any) => x.message);
            const errorMsg = errorsMsgs.join(' ');
            this.ibouSendMessage(errorMsg);
          } else if (error.message === 'error.userexists') {
            this.ibouSendMessage(error.title);
          } else {
            this.ibouSendMessage(err);
          }
        }
      }
    );
  }

  onEditMessage(message: any) {
    if (message.step !== 'PASSWORD') {
      this.inputValue = message.content;
    } else {
      this.inputValue = '';
    }
    if (!this.ibouIsWriting && !this.ibouIsTalking) {
      this.currentStep = message.step;
      this.audioStep = message.audioStep;
      this.updateStepInputType();
      const stepName = registrationSteps[message.step].stepName;
      this.ibouSendMessage(
        `Veuillez saisir votre nouveau ${stepName}`,
        `Modification de votre ${stepName}`,
        undefined,
        true
      );
    }
  }

  send(inputValue: string) {
    if (inputValue !== '') {
      this.inputValue = '';
      switch (this.currentStep) {
        case 'PHONE_NUMBER':
          this.userSendPhoneNumber(inputValue);
          break;
        case 'VALIDATION_CODE':
          this.userSendValidationCode(inputValue);
          break;
        case 'PASSWORD':
          this.userSendPassword(inputValue);
          break;
        case 'PASSWORD_CONFIRM':
          this.userSendConfirmPassword(inputValue);
          break;
        case 'FIRST_NAME':
          this.userSendFirstName(inputValue);
          break;
        case 'LAST_NAME':
          this.userSendLastName(inputValue);
          break;
        case 'EMAIL':
          this.userSendEmail(inputValue);
          break;
        case 'SUCCESS':
          break;
      }
    }
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  togglePwdVisibility() {
    if (this.visibilityIcon === 'visibility') {
      this.stepInputType = 'text';
      this.visibilityIcon = 'visibility_off';
    } else {
      this.stepInputType = 'password';
      this.visibilityIcon = 'visibility';
    }
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio.currentTime = 0;
    // this.generateOTPSubscription.unsubscribe();
    // this.checkOTPSubscription.unsubscribe();
    // this.getAbonneInfosSubscription.unsubscribe();
    // this.checkEmailSubscription.unsubscribe();
    // this.registrationSubscription.unsubscribe();
    // this.checkNumberSubscription.unsubscribe();
  }
}
