import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FaceIdAlertPopupComponent } from './face-id-alert-popup.component';

describe('FaceIdAlertPopupComponent', () => {
  let component: FaceIdAlertPopupComponent;
  let fixture: ComponentFixture<FaceIdAlertPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FaceIdAlertPopupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FaceIdAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
