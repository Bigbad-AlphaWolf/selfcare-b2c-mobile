import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImpliciteAuthenticationModalComponent } from './implicite-authentication-modal.component';

describe('ImpliciteAuthenticationModalComponent', () => {
  let component: ImpliciteAuthenticationModalComponent;
  let fixture: ComponentFixture<ImpliciteAuthenticationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpliciteAuthenticationModalComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImpliciteAuthenticationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
