import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[myScrollVanish]',
})
export class HeaderScrollEffectDirective {
  @Input('myScrollVanish') scrollArea;
  private hidden: boolean = false;
  private triggerDistance: number = 20;

  constructor(
    private element?: ElementRef,
    private renderer?: Renderer2,
    private domCtrl?: DomController
  ) {}

  ngOnInit() {
    this.initStyles();
    this.scrollArea.ionScroll.subscribe((scrollEvent) => {
      let delta = scrollEvent.detail.deltaY;
      console.log(this.element.nativeElement);

      if (scrollEvent.detail.currentY === 0 && this.hidden) {
        this.show();
      } else if (!this.hidden && delta > this.triggerDistance) {
        this.hide();
      } else if (this.hidden && delta < -this.triggerDistance) {
        this.show();
      }
    });
  }

  initStyles() {
    this.domCtrl.write(() => {
      this.renderer.removeClass(this.element.nativeElement, 'show-toolbar');
      this.renderer.removeClass(this.element.nativeElement, 'hide-toolbar');
      this.renderer.addClass(this.element.nativeElement, 'init-header');
    });
  }

  hide() {
    this.domCtrl.write(() => {
      this.renderer.removeClass(this.element.nativeElement, 'show-toolbar');
      this.renderer.addClass(this.element.nativeElement, 'hide-toolbar');
    });

    this.hidden = true;
  }

  show() {
    this.domCtrl.write(() => {
      this.renderer.removeClass(this.element.nativeElement, 'hide-toolbar');
      this.renderer.addClass(this.element.nativeElement, 'show-toolbar');
    });

    this.hidden = false;
  }
}
