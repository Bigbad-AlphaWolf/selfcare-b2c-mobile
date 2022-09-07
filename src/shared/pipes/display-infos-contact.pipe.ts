import { Pipe, PipeTransform } from '@angular/core';
import { ContactOem } from 'src/app/models/contact-oem.model';
import { ContactsService } from 'src/app/services/contacts-service/contacts.service';

@Pipe({
  name: 'displayInfosContact'
})
export class DisplayInfosContactPipe implements PipeTransform {
	constructor(private ctcService?: ContactsService) {

	}
  transform(number: string, ...args: unknown[]): ContactOem {
    return this.ctcService.findContact(number);
  }

}
