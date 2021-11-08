import { Pipe, PipeTransform } from '@angular/core';
import { OffreService } from 'src/app/models/offre-service.model';

@Pipe({
  name: 'searchAssistance',
})
export class SearchAssistancePipe implements PipeTransform {
  regTermSpanO = new RegExp(`<span class='motcle'>`, 'gi');
  regTermSpanF = new RegExp(`</span>`, 'gi');
  searchfields = ['shortDescription', 'fullDescription', 'question', 'reponse'];

  transform(listBas: any[], args?: string): any {
    let newValue = listBas;
    if (null != listBas) {
      if (args && args.trim() != '') {
        let terms = args.trim().split(' ');
        if (terms.length > 0) {
          return listBas
            .filter((ba: OffreService) => {
              ba.countTermMached = 0;
              for (let i = 0; i < terms.length; i++) {
                ba.countFiedMached = this.countFieldMachedTerm(ba, terms[i]);
                ba.countTermMached = ba.countFiedMached
                  ? ++ba.countTermMached
                  : ba.countTermMached;
              }

              return ba.countTermMached;
            })
            .sort((ba1, ba2) => {
              return (
                ba2.countTermMached * ba2.countFiedMached -
                ba1.countTermMached * ba1.countFiedMached
              );
            });
        }
      }
    }

    return listBas;
  }

  clearSpans(ba: OffreService) {
    this.searchfields.forEach((f) => {
      if (ba[f])
        ba[f] = ba[f]
          .replace(this.regTermSpanO, '')
          .replace(this.regTermSpanF, '');
    });

    return ba;
  }

  countFieldMachedTerm(ba: OffreService, term) {
    let countMached = 0;
    this.searchfields.forEach((f) => {
      const regexTermWithoutAccent = new RegExp(this.ignoreAccent(term), 'i');
      if (ba[f] && regexTermWithoutAccent.test(this.ignoreAccent(ba[f]))) {
        countMached++;
      }
    });
    return countMached;
  }

  ignoreAccent(string: string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
}
