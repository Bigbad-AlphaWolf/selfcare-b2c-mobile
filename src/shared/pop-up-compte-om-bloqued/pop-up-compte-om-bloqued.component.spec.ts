import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PopUpCompteOmBloquedComponent } from './pop-up-compte-om-bloqued.component';

describe('PopUpCompteOmBloquedComponent', () => {
  let component: PopUpCompteOmBloquedComponent;
  let fixture: ComponentFixture<PopUpCompteOmBloquedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PopUpCompteOmBloquedComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PopUpCompteOmBloquedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
