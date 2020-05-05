import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';
import { Router } from '@angular/router';

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
    { title: 'J’ai déjà un compte', subtitle: 'Je veux me connecter', type: 'LOGIN', url: '', action: 'REDIRECT' },
    {
        title: 'J’ai oublié mon mot de passe',
        subtitle: 'Je veux le récupérer',
        type: 'FORGOT_PWD',
        url: '',
        action: 'REDIRECT'
    }
];
constructor(private bottomSheetRef: MatBottomSheetRef<CommonIssuesComponent>, private router: Router) {}

ngOnInit() {}

    close() {
        this.bottomSheetRef.dismiss();
    }

    makeAction(option: {
        title: string;
        subtitle: string;
        type: 'ERROR_AUTH_IMP' | 'REGISTER' | 'LOGIN' | 'FORGOT_PWD';
        url?: string;
        action?: 'REDIRECT' | 'POPUP';
    }){        
        switch (option.type) {
            case 'REGISTER':
                if(option.action === 'REDIRECT'){
                    this.router.navigate(['/new-registration']);
                }
                break;
            case 'LOGIN':
                if(option.action === 'REDIRECT'){
                    this.router.navigate(['/login']);
                }
                break;
            case 'FORGOT_PWD':
                if(option.action === 'REDIRECT'){
                    this.router.navigate(['/forgotten-password']);
                }
                break;
            case 'ERROR_AUTH_IMP':
                break;
            default:
                break;
        }
        this.close();
    }

}
