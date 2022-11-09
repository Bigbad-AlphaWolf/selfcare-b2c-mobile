import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { OemLoggingService } from 'src/app/services/oem-logging/oem-logging.service';

@Component({
  selector: 'app-pop-up-compte-om-bloqued',
  templateUrl: './pop-up-compte-om-bloqued.component.html',
  styleUrls: ['./pop-up-compte-om-bloqued.component.scss'],
})
export class PopUpCompteOmBloquedComponent implements OnInit {
  @Output() close = new EventEmitter();
  constructor(private oemLogging: OemLoggingService, private router: Router) {}

  ngOnInit() {}

  goToUnbblockOMAccountPage() {
    this.router.navigate(['/om-self-operation/unblock-om-account']);
    this.oemLogging.registerEvent('Debloquer-mon-compte-orange-money_menu');
  }

  closePopUp() {
    this.close.emit();
  }
}
