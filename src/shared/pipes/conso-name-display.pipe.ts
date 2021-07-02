import { Pipe, PipeTransform } from '@angular/core';
import {
  BONUS_APPEL,
  BONUS_DATA,
  BONUS_INTERNET,
  BONUS_SMS,
  BONUS_VOIX,
  CONSO_ACTE_INTERNET,
  CONSO_ACTE_SMS,
  CONSO_ACTE_VOIX,
  CONSO_APPEL,
  CONSO_INTERNET,
  CONSO_SMS,
  FORFAIT_BONUS_DATA,
  FORFAIT_BONUS_SMS,
  FORFAIT_BONUS_VOIX,
  FORFAIT_INTERNET,
  FORFAIT_MOBILE,
  NewUserConsoModel,
  SOLDE_RESTANT_INTERNET,
  SOLDE_RESTANT_VOIX,
} from 'src/app/services/user-cunsommation-service/user-conso-service.index';

@Pipe({
  name: 'consoNameDisplay',
})
export class ConsoNameDisplayPipe implements PipeTransform {
  transform(consoName: string, args?: any): any {
    switch (consoName.toLowerCase()) {
      case CONSO_ACTE_VOIX:
        return CONSO_APPEL;
      case CONSO_ACTE_INTERNET:
        return CONSO_INTERNET;
      case CONSO_ACTE_SMS:
        return CONSO_SMS;
      case FORFAIT_INTERNET:
        return SOLDE_RESTANT_INTERNET;
      case FORFAIT_BONUS_DATA:
      case BONUS_DATA:
        return BONUS_INTERNET;
      case FORFAIT_MOBILE:
        return SOLDE_RESTANT_VOIX;
      case FORFAIT_BONUS_VOIX:
      case BONUS_VOIX:
        return BONUS_APPEL;
      case BONUS_SMS:
      case FORFAIT_BONUS_SMS:
        return BONUS_SMS;
      default:
        return consoName;
    }
    return null;
  }
}
