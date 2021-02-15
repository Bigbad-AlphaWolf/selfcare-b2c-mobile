import { AfterViewChecked, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appGaugeKnob]',
})
export class GaugeKnobDirective implements AfterViewChecked {
  @Input('appGaugeKnob') dataOpacity: number;

  constructor(private el?: ElementRef) {}

  ngAfterViewChecked() {
    this.setGaugeBorder();
    this.setBarOpacity();
  }

  setGaugeBorder() {
    let knob = this.el.nativeElement.shadowRoot.querySelector('.range-knob');
    if (!knob) return;
    knob.style.border = 'solid 2px #ffffff';
  }

  setBarOpacity() {
    if (!this.dataOpacity) return;
    const rangeBar = <HTMLElement>(
      this.el.nativeElement.shadowRoot.querySelector('.range-bar')
    );
    const rangeBarActive = <HTMLElement>(
      this.el.nativeElement.shadowRoot.querySelector('.range-bar-active')
    );
    rangeBar.style.opacity = `${1 - this.dataOpacity}`;
    rangeBarActive.style.opacity = `${this.dataOpacity * 0.75 + 0.3}`;
  }
}
