import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {FollowAnalyticsService} from 'src/app/services/follow-analytics/follow-analytics.service';

@Component({
  selector: 'app-pop-up-compte-om-bloqued',
  templateUrl: './pop-up-compte-om-bloqued.component.html',
  styleUrls: ['./pop-up-compte-om-bloqued.component.scss']
})
export class PopUpCompteOmBloquedComponent implements OnInit {
  @Output() close = new EventEmitter();
  constructor(private followAnalyticsService: FollowAnalyticsService, private router: Router) {}

  ngOnInit() {}

  goToUnbblockOMAccountPage() {
    this.router.navigate(['/om-self-operation/unblock-om-account']);
    this.followAnalyticsService.registerEventFollow('Debloquer-mon-compte-orange-money_menu', 'event');
  }

  closePopUp() {
    this.close.emit();
  }
}
