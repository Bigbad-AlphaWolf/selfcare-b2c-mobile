import { Pipe, PipeTransform } from '@angular/core';
import { ItemBesoinAide } from 'src/shared';

@Pipe({
  name: 'searchAssistance',
})
export class SearchAssistancePipe implements PipeTransform {
  regTermSpanO = new RegExp(`<span class='motcle'>`, 'gi');
  regTermSpanF = new RegExp(`</span>`, 'gi');
  searchfields = ['descCourte', 'descLong', 'question', 'reponse'];

  transform(listBas: any[], args?: string): any {
    let newValue = listBas;
    if (null != listBas) {
      if (args.trim() != '') {
        let terms = args.trim().split(' ');
        if (terms.length > 0) {
          return listBas
            .filter((ba: ItemBesoinAide) => {
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

  clearSpans(ba: ItemBesoinAide) {
    this.searchfields.forEach((f) => {
      if (ba[f])
        ba[f] = ba[f]
          .replace(this.regTermSpanO, '')
          .replace(this.regTermSpanF, '');
    });

    return ba;
  }
  countFieldMachedTerm(ba: ItemBesoinAide, term) {
    let countMached = 0;
    const regTerm = new RegExp(term, 'i');
    this.searchfields.forEach((f) => {
      if (ba[f] && regTerm.test(ba[f])) {
        countMached++;
      }
    });
    return countMached;
  }
}
