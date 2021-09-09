import {Pipe, PipeTransform} from '@angular/core';
import {FILE_DOWNLOAD_ENDPOINT} from 'src/app/services/utils/file.endpoints';
import {FILE_PATH} from 'src/app/services/utils/services.paths';

@Pipe({
  name: 'displayFileManagerImage'
})
export class DisplayFileManagerImagePipe implements PipeTransform {
  FILE_MANAGER_BASE_URL = FILE_PATH;

  transform(imageName: string, ...args: unknown[]): unknown {
    return `${this.FILE_MANAGER_BASE_URL}/${imageName}`;
  }
}
