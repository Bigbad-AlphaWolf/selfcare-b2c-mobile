import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-select-pass-recipient',
  templateUrl: './select-pass-recipient.page.html',
  styleUrls: ['./select-pass-recipient.page.scss'],
})
export class SelectPassRecipientPage implements OnInit {

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        console.log(this.router.getCurrentNavigation().extras.state.user.test);
      }
    });
  }

}
