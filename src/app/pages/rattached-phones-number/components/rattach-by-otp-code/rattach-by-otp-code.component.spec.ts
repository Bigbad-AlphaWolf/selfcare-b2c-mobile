import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RattachByOtpCodeComponent } from './rattach-by-otp-code.component';

describe('RattachByOtpCodeComponent', () => {
  let component: RattachByOtpCodeComponent;
  let fixture: ComponentFixture<RattachByOtpCodeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RattachByOtpCodeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RattachByOtpCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
