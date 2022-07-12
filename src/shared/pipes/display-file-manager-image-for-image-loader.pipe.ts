import { Pipe, PipeTransform } from '@angular/core';
import { FILE_DOWNLOAD_ENDPOINT } from 'src/app/services/utils/file.endpoints';

@Pipe({
  name: 'displayFileManagerImageForImageLoader'
})
export class DisplayFileManagerImageForImageLoaderPipe implements PipeTransform {
	FILE_MANAGER_BASE_URL = FILE_DOWNLOAD_ENDPOINT;

  transform(imageName: string, ...args: unknown[]): unknown {
    return `${this.FILE_MANAGER_BASE_URL}/${imageName}`;
  }

}
