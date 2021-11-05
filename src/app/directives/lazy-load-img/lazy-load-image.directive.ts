import {AfterViewInit, Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit, OnChanges {
  @HostBinding('attr.src') srcAttr = null;
  @Input() src: string;
  @Input() inViewport: boolean;
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    //console.log('lazyyyy', this.el);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inViewport) {
      this.loadImage();
    }
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({isIntersecting}) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.srcAttr = this.src;
  }
}
