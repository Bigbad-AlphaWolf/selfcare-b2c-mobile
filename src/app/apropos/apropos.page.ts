import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apropos',
  templateUrl: './apropos.page.html',
  styleUrls: ['./apropos.page.scss']
})
export class AproposPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  presentAlert() {
    this.router.navigate(['/infolegales']);
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
