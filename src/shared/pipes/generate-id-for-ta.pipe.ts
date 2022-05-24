import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'generateIdForTA'
})
export class GenerateIdForTAPipe implements PipeTransform {
  transform(idValue: string): string {
    const package_name_android = 'com.orange.myorange.osn';
    return package_name_android + `:id/${idValue}`;
  }
}
