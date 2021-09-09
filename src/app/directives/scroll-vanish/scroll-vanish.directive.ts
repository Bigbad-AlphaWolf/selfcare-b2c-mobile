import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
const triggerDistance = 50;

@Directive({
  selector: '[appScrollVanish]',
})
export class ScrollVanishDirective {
  @Input('appScrollVanish') scrollArea;
  @Input('iconSearch') iconClassName: string;
  @Input('searchBlock') searchBlockClassName: string;
  @Input('homeDashboard') isForDashboard: boolean;
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
        document.querySelector(this.searchBlockClassName).children[0],
        'transition',
        'all 0.28s linear'
      );
      if (this.isForDashboard) {
        this.hide();
      }
      this.renderer.setStyle(
        document.querySelector(this.iconClassName),
        'transition',
        '0.48s linear'
      );
      this.renderer.setStyle(
        document.querySelector(this.iconClassName),
        'display',
        'none'
      );
    });
  }

  hide() {
    this.domCtrl.write(() => {
      // if (this.isForDashboard) {
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName),
        'margin-top',
        '0px'
      );
      // }
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'min-height',
        '0px'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'height',
        '0px'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'opacity',
        '0'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'padding',
        '0'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'margin-top',
        '0'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'visibility',
        'hidden'
      );
      this.renderer.setStyle(
        document.querySelector(this.iconClassName),
        'display',
        'block'
      );
    });
    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      if (this.isForDashboard) {
        this.renderer.setStyle(
          this.element.nativeElement.children[1],
          'margin-top',
          '80px'
        );
      }
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'height',
        '60px'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'margin-top',
        '15px'
      );
      this.renderer.removeStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'opacity'
      );
      this.renderer.removeStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'min-height'
      );
      this.renderer.removeStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'padding'
      );
      this.renderer.setStyle(
        document.querySelector(this.searchBlockClassName).children[0],
        'visibility',
        'visible'
      );
      this.renderer.setStyle(
        document.querySelector(this.iconClassName),
        'display',
        'none'
      );
    });
    this.hidden = false;
  }
}
