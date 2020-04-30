import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-common-issues',
  templateUrl: './common-issues.component.html',
  styleUrls: ['./common-issues.component.scss'],
})
export class CommonIssuesComponent implements OnInit {

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
constructor(private bottomSheetRef: MatBottomSheetRef<CommonIssuesComponent>) {}

ngOnInit() {}

close() {
    this.bottomSheetRef.dismiss();
}

}
