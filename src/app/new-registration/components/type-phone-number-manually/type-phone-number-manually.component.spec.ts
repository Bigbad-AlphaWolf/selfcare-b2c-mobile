import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TypePhoneNumberManuallyComponent } from './type-phone-number-manually.component';

describe('TypePhoneNumberManuallyComponent', () => {
  let component: TypePhoneNumberManuallyComponent;
  let fixture: ComponentFixture<TypePhoneNumberManuallyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TypePhoneNumberManuallyComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TypePhoneNumberManuallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
