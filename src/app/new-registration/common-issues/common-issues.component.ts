import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material/bottom-sheet';
@Component({
  selector: 'app-common-issues',
  templateUrl: './common-issues.component.html',
  styleUrls: ['./common-issues.component.scss'],
})
export class CommonIssuesComponent implements OnInit {
    popupTitle='Quel soucis rencontrez-vous ?';
  options: {
    title: string;
    subtitle: string;
    type: 'ERROR_AUTH_IMP' | 'REGISTER' | 'LOGIN' | 'FORGOT_PWD';
    url?: string;
    action?: 'REDIRECT' | 'POPUP';
}[] = [
    {
        title: 'Mon numéro ne s’affiche pas',
        subtitle: 'Regarder le tutoriel',
        type: 'ERROR_AUTH_IMP',
        url: '',
        action: 'POPUP'
    },
    {
        title: 'C’est ma première connexion',
        subtitle: 'Je veux créer un compte',
        type: 'REGISTER',
        url: '',
        action: 'REDIRECT'
    },
    { title: 'J’ai déjà un compte', subtitle: 'Je veux me connecter', type: 'LOGIN', url: '', action: 'POPUP' },
    {
        title: 'J’ai oublié mon mot de passe',
        subtitle: 'Je veux le récupérer',
        type: 'FORGOT_PWD',
        url: '',
        action: 'REDIRECT'
    }
];
constructor(private bottomSheetRef: MatBottomSheetRef<CommonIssuesComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    if(data){

        this.options=data.options;
        this.popupTitle = data.popupTitle;
    }
}

ngOnInit() {}

close() {
    console.log('clicked on close');
    console.log(this.bottomSheetRef);
    this.bottomSheetRef.dismiss();
    console.log('after closed');
}

}
