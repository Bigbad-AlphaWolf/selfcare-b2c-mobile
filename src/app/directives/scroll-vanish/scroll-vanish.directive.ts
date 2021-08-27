import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';
const triggerDistance = 110;

@Directive({
  selector: '[appScrollVanish]',
})
export class ScrollVanishDirective {
  @Input('appScrollVanish') scrollArea;
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
        this.element.nativeElement,
        'transition',
        '0.28s linear'
      );
      this.renderer.setStyle(this.element.nativeElement, 'height', '60px');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'min-height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'height', '0px');
      this.renderer.setStyle(this.element.nativeElement, 'opacity', '0');
      this.renderer.setStyle(this.element.nativeElement, 'padding', '0');
      this.renderer.setStyle(this.element.nativeElement, 'margin-top', '0');
      this.renderer.setStyle(
        this.element.nativeElement,
        'visibility',
        'hidden'
      );
    });
    this.hidden = true;
  }
  show() {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.element.nativeElement, 'height', '60px');
      this.renderer.setStyle(this.element.nativeElement, 'margin-top', '15px');
      this.renderer.removeStyle(this.element.nativeElement, 'opacity');
      this.renderer.removeStyle(this.element.nativeElement, 'min-height');
      this.renderer.removeStyle(this.element.nativeElement, 'padding');
      this.renderer.setStyle(
        this.element.nativeElement,
        'visibility',
        'visible'
      );
    });
    this.hidden = false;
  }
}
