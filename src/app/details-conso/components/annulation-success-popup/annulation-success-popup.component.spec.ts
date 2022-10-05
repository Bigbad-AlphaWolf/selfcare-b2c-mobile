import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AnnulationSuccessPopupComponent } from './annulation-success-popup.component';

describe('AnnulationSuccessPopupComponent', () => {
  let component: AnnulationSuccessPopupComponent;
  let fixture: ComponentFixture<AnnulationSuccessPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnulationSuccessPopupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AnnulationSuccessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
