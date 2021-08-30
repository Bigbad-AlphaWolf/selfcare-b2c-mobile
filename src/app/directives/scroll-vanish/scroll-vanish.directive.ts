import {
  Directive,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { DomController } from '@ionic/angular';
const triggerDistance = 110;

@Directive({
  selector: '[appScrollVanish]',
})
export class ScrollVanishDirective {
  @Input('appScrollVanish') scrollArea;
  @Input('isDashboard') isDirectiveForDashboardPage;
  private hidden: boolean = false;

  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private domCtrl: DomController
  ) {}

  ngOnInit() {
    this.initStyles();
    this.scrollArea.ionScroll.subscribe((scrollEvent) => {
      let delta = scrollEvent.detail.deltaY;
      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -triggerDistance) {
        this.show();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'transition',
        '0.28s linear'
      );
      this.renderer.setStyle(
        this.element.nativeElement.querySelector('.search-icon'),
        'transition',
        '0.48s linear'
      );
      if (this.isDirectiveForDashboardPage) {
        this.hide();
        return;
      }
      this.renderer.setStyle(
        this.element.nativeElement.querySelector('.search-icon'),
        'display',
        'none'
      );
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'min-height',
        '0px'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'height',
        '0px'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'opacity',
        '0'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'padding',
        '0'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'margin-top',
        '0'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'visibility',
        'hidden'
      );
      this.renderer.setStyle(
        this.element.nativeElement.querySelector('.search-icon'),
        'display',
        'block'
      );
    });
    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'height',
        '60px'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'margin-top',
        '15px'
      );
      this.renderer.removeStyle(
        this.element.nativeElement.children[1],
        'opacity'
      );
      this.renderer.removeStyle(
        this.element.nativeElement.children[1],
        'min-height'
      );
      this.renderer.removeStyle(
        this.element.nativeElement.children[1],
        'padding'
      );
      this.renderer.setStyle(
        this.element.nativeElement.children[1],
        'visibility',
        'visible'
      );
      this.renderer.setStyle(
        this.element.nativeElement.querySelector('.search-icon'),
        'display',
        'none'
      );
    });
    this.hidden = false;
  }
}
