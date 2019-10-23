import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-infolegales',
  templateUrl: './infolegales.page.html',
  styleUrls: ['./infolegales.page.scss']
})
export class InfolegalesPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  goBack() {
    this.router.navigate(['/apropos']);
  }
}
