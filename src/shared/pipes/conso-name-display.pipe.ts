import { Pipe, PipeTransform } from '@angular/core';
import {
  BONUS_DATA,
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
      case FORFAIT_BONUS_DATA:
      case BONUS_DATA:
        return SOLDE_RESTANT_INTERNET;
      case FORFAIT_MOBILE:
      case FORFAIT_BONUS_VOIX:
      case BONUS_VOIX:
        return SOLDE_RESTANT_VOIX;
      case BONUS_SMS:
      case FORFAIT_BONUS_SMS:
        return BONUS_SMS;
      default:
        return consoName;
    }
    return null;
  }
}
