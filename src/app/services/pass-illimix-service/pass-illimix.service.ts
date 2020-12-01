import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {
  PassIllimModel,
  PromoPassIllimModel,
  PassIllimixModel,
  getOrderedListCategory,
  getListPassFilteredByLabelAndPaymentMod,
  ALLO_PASS_CATEGORY,
} from 'src/shared';
import { DashboardService } from '../dashboard-service/dashboard.service';
import { AuthenticationService } from '../authentication-service/authentication.service';
import { SubscriptionModel } from 'src/app/dashboard';

import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
const { SERVER_API_URL, CONSO_SERVICE } = environment;
const passByIdEndpoint = `${SERVER_API_URL}/${CONSO_SERVICE}/api/pass-illimixes`;
@Injectable({
  providedIn: 'root',
})
export class PassIllimixService {
  private userCodeFormule: string;
  private listPassIllimix: (PassIllimModel | PromoPassIllimModel)[] = [];
  private listPassIllimixShown: (PassIllimModel | PromoPassIllimModel)[];
  private listCategoryPass: any;
  private passLoadedSubject: Subject<any> = new Subject<any>();
  constructor(
    private dashbService: DashboardService,
    private http: HttpClient
  ) {}

  setUserCodeFormule(msisdn: string) {
    this.userCodeFormule = msisdn;
  }

  queryListPassIllimix(codeFormule: string, category?: string) {
    this.listPassIllimix = [];
    return this.dashbService.getListPassIllimix(codeFormule, category).pipe(
      map((res: PassIllimixModel[]) => {
        res.forEach((x) => {
          const isPassAllo =
            (x.pass &&
              x.pass.categoriePass.libelle.toLowerCase() ===
                ALLO_PASS_CATEGORY.toLowerCase()) ||
            (x.promoPass &&
              x.promoPass.passPromo.categoriePass.libelle.toLowerCase() !==
                ALLO_PASS_CATEGORY.toLowerCase());
          if (x.pass && x.pass.actif) {
            if (category || !isPassAllo) this.listPassIllimix.push(x.pass);
          } else if (x.promoPass && x.promoPass.passPromo.actif) {
            if (category || !isPassAllo) this.listPassIllimix.push(x.promoPass);
          }
        });
        // get from all pass the different categories
        let list = res.map((x) => {
          if (x.pass) {
            return x.pass.categoriePass;
          } else if (x.promoPass) {
            return x.promoPass.passPromo.categoriePass;
          }
        });
        // hide allo category if all illimix requested ie if no category specified
        if (!category) {
          list = list.filter((category) => {
            return (
              category.libelle.toLowerCase() !==
              ALLO_PASS_CATEGORY.toLowerCase()
            );
          });
        }
        this.listCategoryPass = getOrderedListCategory(list);
        this.listPassIllimixShown = getListPassFilteredByLabelAndPaymentMod(
          this.listCategoryPass[0],
          this.listPassIllimix
        );
        return list;
      })
    );
  }

  getCategoryListPassIllimix() {
    return this.listCategoryPass;
  }
  getListPassIllimix() {
    return this.listPassIllimix;
  }

  getListPassIllimixShown() {
    return this.listPassIllimixShown;
  }
  getStatusLoadingPass() {
    return this.passLoadedSubject.asObservable();
  }

  getPassById(id: number) {
    return this.http.get(`${passByIdEndpoint}/${id}`);
  }
}
