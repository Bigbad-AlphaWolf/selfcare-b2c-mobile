import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[noIonSelectArrow]',
})
export class NoIonSelectArrowDirective {
  private observer: MutationObserver;

  constructor(private el?: ElementRef) {
    const node = this.el.nativeElement;

    this.observer = new MutationObserver((mutations) => {
      this.removeArrow();
    });

    this.observer.observe(node, {
      childList: true,
    });
  }

  private removeArrow() {
    let icon: HTMLElement = this.el.nativeElement.shadowRoot.querySelector(
      '.select-icon'
    );
    if (icon === null) {
      return;
    }
    // This mutation has added the arrow. Remove it.
    icon.setAttribute('style', 'display: none !important');
    this.observer.disconnect();
  }
}
