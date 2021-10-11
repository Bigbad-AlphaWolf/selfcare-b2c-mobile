import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MsisdnAssistanceModalComponent } from './msisdn-assistance-modal.component';

describe('MsisdnAssistanceModalComponent', () => {
  let component: MsisdnAssistanceModalComponent;
  let fixture: ComponentFixture<MsisdnAssistanceModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MsisdnAssistanceModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MsisdnAssistanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
