import { Directive, Input, ElementRef, Renderer2 } from '@angular/core';
import { SargalStatusCard } from '../models/enums/sargal-status-card.enum';

@Directive({
  selector: '[appOemStatusSargalLabel]'
})
export class OemStatusSargalLabelDirective {
  @Input('appOemStatusSargalLabel')  status: string;
  constructor(private elRef?: ElementRef<HTMLElement>,
    private renderer?: Renderer2) {   }

   ngOnInit() {
     console.log('dire',status);
     
    if(status === SargalStatusCard.GOLD){
      this.renderer.setStyle(this.elRef.nativeElement, 'color', 'gold')
    }else if(this.status === SargalStatusCard.PLATINUM){
      this.renderer.setStyle(this.elRef.nativeElement, 'color', 'red')
    }

   }


}
