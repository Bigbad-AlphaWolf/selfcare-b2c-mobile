import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'codeFormat'
})
export class CodeFormatPipe implements PipeTransform {

  transform(code: string, distance?: any): any {
    if(!(code && code.length > 0)) return code;
    distance = distance?distance:2;
    let result = '';
    let start = 0;
    while(start < (code.length -distance)){
      result += ' ' + code.slice(start, start + distance);
      start += distance;
    }
    
    result += code.slice(start, code.length);
    return result.trim();
  }

}
