import {
  Directive,
  ElementRef,
  AfterViewInit,
  AfterViewChecked,
  OnInit,
  Renderer2,
  Input,
} from '@angular/core';

@Directive({
  selector: '[oemIonHeaderParallax]',
})
export class OemIonHeaderParallaxDirective
  implements AfterViewInit, AfterViewChecked, OnInit {
  scrollEl: HTMLElement;
  parallaxEl: HTMLElement;
  @Input('oemIonHeaderParallax') maxHeight: number = 100;
  buttonsEl: HTMLElement;
  toolBarEl: HTMLElement;
  titleEl: HTMLElement;
  wrapperTitleEl: HTMLElement;
  containerToolBarEl: HTMLElement;
  toolBarTitleEl: HTMLElement;

  constructor(
    private elRef?: ElementRef<HTMLElement>,
    private renderer?: Renderer2
  ) {}
  ngOnInit(): void {}
  ngAfterViewChecked(): void {
    if (this.containerToolBarEl) return;
    if (this.toolBarEl && this.toolBarEl.shadowRoot){
      this.containerToolBarEl = this.toolBarEl.shadowRoot.querySelector(
        '.toolbar-container'
      );
      this.toolBarTitleEl = this.titleEl.shadowRoot.querySelector(
        '.toolbar-title'
      );
    }

    if (!this.containerToolBarEl) return;

    this.initElements();
  }

  private initElements() {
    this.wrapperTitleEl = this.renderer.createElement('div');
    this.renderer.insertBefore(
      this.toolBarEl,
      this.wrapperTitleEl,
      this.titleEl
    );
    this.renderer.appendChild(this.wrapperTitleEl, this.titleEl);
    this.expandedToolBar();
    this.expandedWrapperTitle();
    this.renderer.setStyle(this.titleEl, 'font-size', '24px');
    this.renderer.setStyle(this.titleEl, 'position', 'sticky');
    this.renderer.setStyle(this.titleEl, 'padding', '0px 15px');
    this.renderer.setStyle(this.titleEl, 'top', '10px');
    this.renderer.setStyle(this.titleEl, 'text-align', 'left');
    this.renderer.setStyle(this.titleEl, 'align-self', 'flex-end');
    this.renderer.setStyle(this.titleEl, 'height', 'fit-content');

    // this.renderer.setStyle(this.toolBarTitleEl, 'position', 'relative');
    // this.renderer.setStyle(this.toolBarTitleEl, 'top', '2px');


    this.initScrollEvent();
  }

  ngAfterViewInit(): void {
    this.parallaxEl = this.elRef.nativeElement;
    let parentEl = this.parallaxEl.parentElement;
    this.scrollEl = parentEl.querySelector('ion-content');

    this.buttonsEl = this.parallaxEl.querySelector('ion-buttons');
    this.buttonsEl.setAttribute('slot', 'start');

    this.toolBarEl = this.parallaxEl.querySelector('ion-toolbar');
    if (!this.toolBarEl) {
      throw new Error(
        'Parallax directive requires a ion-toolbar element on the page to work.'
      );
    }

    if(this.toolBarEl.shadowRoot){

      this.containerToolBarEl = this.toolBarEl.shadowRoot.querySelector(
        '.toolbar-container'
      );
    }

    this.titleEl = this.toolBarEl.querySelector('ion-title');

    if (!this.containerToolBarEl) return;

    this.initElements();
  }

  initScrollEvent() {
    if (this.scrollEl) {
      this.scrollEl.addEventListener('ionScroll', (e: CustomEvent) => {
        window.requestAnimationFrame(() => {
          this.onScroll(e);
        });
      });
    }
  }

  onScroll(ev: CustomEvent) {
    
    if(ev.detail.scrollTop <0)return;
    let scrollTop = ev.detail.scrollTop ;
    
    if (50 > this.maxHeight - scrollTop) {
      //Normal Toolbar

      this.normalToolbar();

      this.normalWrapperTitle();

      this.renderer.setStyle(this.titleEl, 'font-size', '20px');

      return;
    }

    this.expandedToolBar(scrollTop);
    this.expandedWrapperTitle();

    this.renderer.setStyle(this.titleEl, 'font-size', '24px');
  }

  private expandedWrapperTitle() {
    this.renderer.setStyle(this.wrapperTitleEl, 'position', 'absolute');
    this.renderer.setStyle(this.wrapperTitleEl, 'top', 0);
    this.renderer.setStyle(this.wrapperTitleEl, 'left', 0);
    this.renderer.setStyle(this.wrapperTitleEl, 'right', 0);
    this.renderer.setStyle(this.wrapperTitleEl, 'bottom', 0);
    this.renderer.setStyle(this.wrapperTitleEl, 'height', '100%');
    this.renderer.setStyle(this.wrapperTitleEl, 'flex-grow', '1');
    this.renderer.setStyle(this.wrapperTitleEl, 'display', 'flex');
    this.renderer.setStyle(this.wrapperTitleEl, 'align-items', 'flex-end');
  }

  private expandedToolBar(scrollTop: number = 0) {
    this.renderer.setStyle(
      this.containerToolBarEl,
      'height',
      `${this.maxHeight - scrollTop}px`
    );
    this.renderer.setStyle(this.containerToolBarEl, 'display', 'flex');
    this.renderer.setStyle(
      this.containerToolBarEl,
      'align-items',
      'flex-start'
    );
    this.renderer.setStyle(this.containerToolBarEl, 'flex-direction', 'column');
    this.renderer.setStyle(this.containerToolBarEl, 'margin', '0px 0px 10px');
  }

  private normalWrapperTitle() {
    this.renderer.setStyle(this.wrapperTitleEl, 'bottom', '0px');
    this.renderer.setStyle(this.wrapperTitleEl, 'position', 'relative');
    this.renderer.setStyle(this.wrapperTitleEl, 'height', 'fit-content');

  }

  private normalToolbar() {
    this.renderer.setStyle(this.containerToolBarEl, 'display', 'flex');
    this.renderer.setStyle(this.containerToolBarEl, 'align-items', 'center');
    this.renderer.setStyle(this.containerToolBarEl, 'flex-direction', 'row');
    this.renderer.setStyle(this.containerToolBarEl, 'height', 'auto');
    this.renderer.setStyle(this.containerToolBarEl, 'margin', '0px');

  }
}
