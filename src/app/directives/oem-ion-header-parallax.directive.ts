import { Directive, HostListener, ElementRef, AfterViewInit, AfterContentInit, AfterViewChecked, OnInit, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[oemIonHeaderParallax]'
})
export class OemIonHeaderParallaxDirective implements AfterViewInit, AfterViewChecked, OnInit{ 

  scrollEl:HTMLElement;
  parallaxEl: HTMLElement;
  @Input('oemIonHeaderParallax') maxHeight: number = 100;
  buttonsEl: HTMLElement; 
  toolBarEl: HTMLElement;
  titleEl: HTMLElement;
  wrapperTitleEl: HTMLElement;
  containerToolBarEl:HTMLElement;

  constructor(private elRef:ElementRef<HTMLElement>, private renderer:Renderer2) { }
  ngOnInit(): void {
  }
  ngAfterViewChecked(): void {
    if(this.containerToolBarEl) return;
    if(this.toolBarEl)
    this.containerToolBarEl = this.toolBarEl.shadowRoot.querySelector('.toolbar-container');

    if(!this.containerToolBarEl) return;

    this.initElements();

  }

 

  private initElements() {
    this.wrapperTitleEl = this.renderer.createElement('div');
    this.renderer.insertBefore(this.toolBarEl, this.wrapperTitleEl, this.titleEl);
    this.renderer.appendChild(this.wrapperTitleEl, this.titleEl);
    this.expandedToolBar();
    this.expandedWrapperTitle();
    this.renderer.setStyle(this.titleEl, 'font-size', '24px');
    this.initScrollEvent();
  }

  ngAfterViewInit(): void {
    this.parallaxEl = this.elRef.nativeElement;
    let parentEl = this.parallaxEl.parentElement;
    this.scrollEl = parentEl.querySelector('ion-content');

    this.buttonsEl = this.parallaxEl.querySelector('ion-buttons');
    this.buttonsEl.setAttribute('slot','start');

    this.toolBarEl = this.parallaxEl.querySelector('ion-toolbar');
    if (!this.toolBarEl) { throw new Error('Parallax directive requires a ion-toolbar element on the page to work.'); }

    this.containerToolBarEl = this.toolBarEl.shadowRoot.querySelector('.toolbar-container');

    this.titleEl = this.toolBarEl.querySelector('ion-title');
    
    if(!this.containerToolBarEl) return;
    
    this.initElements();

  }

  initScrollEvent(){
    if (this.scrollEl) {
      this.scrollEl.addEventListener('ionScroll', (e:CustomEvent) => {
          window.requestAnimationFrame(() => {
            this.onScroll(e);
          });

      });
    }
  }

  onScroll(ev:CustomEvent) { 
    
    let scrollTop = ev.detail.scrollTop /2;
     
    if( 52 > (this.maxHeight-scrollTop)){//Normal Toolbar

      this.normalToolbar();

      this.normalWrapperTitle();
   
      this.renderer.setStyle(this.titleEl,'font-size', '20px');


      return;
    }
   
    this.expandedToolBar(scrollTop);
    this.expandedWrapperTitle();

    this.renderer.setStyle(this.titleEl,'font-size', '24px');

  }

  private expandedWrapperTitle(){
    this.renderer.setStyle(this.wrapperTitleEl, 'position', 'absolute');
    this.renderer.setStyle(this.wrapperTitleEl, 'bottom', '10px');
    this.renderer.setStyle(this.wrapperTitleEl, 'height', 'fit-content');
  }

  private expandedToolBar(scrollTop:number=0) {
    this.renderer.setStyle(this.containerToolBarEl, 'height', `${this.maxHeight-scrollTop}px`);
    this.renderer.setStyle(this.containerToolBarEl, 'display', 'flex');
    this.renderer.setStyle(this.containerToolBarEl, 'align-items', 'flex-start');
    this.renderer.setStyle(this.containerToolBarEl, 'flex-direction', 'column');
  }

  private normalWrapperTitle() {
    this.renderer.setStyle(this.wrapperTitleEl, 'bottom', '0');
    this.renderer.setStyle(this.wrapperTitleEl, 'position', 'relative');

  }

  private normalToolbar() {
    this.renderer.setStyle(this.containerToolBarEl, 'display', 'flex');
    this.renderer.setStyle(this.containerToolBarEl, 'align-items', 'center');
    this.renderer.setStyle(this.containerToolBarEl, 'flex-direction', 'row');
    this.renderer.setStyle(this.containerToolBarEl, 'height', 'auto');
  }

}
