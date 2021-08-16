import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';


// TODO: Add Angular decorator.
export class BaseComponent implements OnDestroy {

  ngUnsubscribe = new Subject<void>();

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
