import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-msg-line',
  templateUrl: './chat-msg-line.component.html',
  styleUrls: ['./chat-msg-line.component.scss']
})
export class ChatMsgLineComponent implements OnInit {
  @Input() type;
  @Input() title;
  @Input() content;
  @Input() origin;
  @Input() editable;
  @Input() editType;
  @Input() step;
  @Input() audioStep;
  @Input() link;
  @Input() disableYesNo;
  @Input() inputFocus;

  @Output() editInput = new EventEmitter();
  @Output() yesNoAnswer = new EventEmitter();
  @Output() resendCodeEvent = new EventEmitter();
  @Output() answerRememberEvent = new EventEmitter();
  @Output() line = new EventEmitter();
  @Output() verifSheet = new EventEmitter();
  @Output() idenSheet = new EventEmitter();
  @Output() focusInputEvent = new EventEmitter();

  lines = {
    setted: false,
    data: [
      {
        imageURL: '/assets/images/new_mobile.svg',
        name: 'mobile',
        choosen: false,
        step: 'CHOOSE_LINE'
      },
      {
        imageURL: '/assets/images/new_fixe.svg',
        name: 'fixe',
        choosen: false,
        step: 'CHOOSE_LINE'
      }
    ]
  };

  verificationSheets = {
    setted: false,
    data: [
      {
        imageURL: '/assets/images/new_carte-idendite.svg',
        name: `piece d'identité`,
        choosen: false,
        step: 'CHOOSE_LINE'
      },
      {
        imageURL: '/assets/images/new_derniere-facture.svg',
        name: 'Dernière facture',
        choosen: false,
        step: 'CHOOSE_LINE'
      }
    ]
  };

  identificationSheets = {
    setted: false,
    data: [
      {
        imageURL: '/assets/images/new_carte-idendite.svg',
        name: `carte d'identité`,
        choosen: false,
        step: 'CHOOSE_LINE'
      },
      {
        imageURL: '/assets/images/new_passport.svg',
        name: 'passport',
        choosen: false,
        step: 'CHOOSE_LINE'
      }
    ]
  };

  constructor(private router: Router) {}

  ngOnInit() {}

  resendCode() {
    this.resendCodeEvent.emit();
  }

  selectLine(index: number) {
    if (!this.lines.setted) {
      this.lines.data[index].choosen = true;
      this.line.emit(this.lines.data[index]);
      this.lines.setted = true;
    }
  }

  selectVerifSheet(index: number) {
    if (!this.verificationSheets.setted) {
      this.verificationSheets.data[index].choosen = true;
      this.verifSheet.emit(this.verificationSheets.data[index]);
      this.verificationSheets.setted = true;
    }
  }

  selectCniOrPass(index: number) {
    if (!this.identificationSheets.setted) {
      this.identificationSheets.data[index].choosen = true;
      this.idenSheet.emit(this.identificationSheets.data[index]);
      this.identificationSheets.setted = true;
    }
  }

  editValue() {
    const message = {
      type: this.type,
      title: this.title,
      content: this.content,
      step: this.step,
      audioStep: this.audioStep,
      origin: this.origin,
      editable: this.editable,
      editType: this.editType
    };
    this.editInput.emit(message);
  }

  sendYesNo(answer: boolean) {
    this.yesNoAnswer.emit(answer);
  }

  goToLink(link: string) {
    this.router.navigate([link]);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  answerRememberMe(answer: string) {
    this.answerRememberEvent.emit(answer);
  }

  clickOnMessage() {
    this.focusInputEvent.emit(this.inputFocus);
  }
}
