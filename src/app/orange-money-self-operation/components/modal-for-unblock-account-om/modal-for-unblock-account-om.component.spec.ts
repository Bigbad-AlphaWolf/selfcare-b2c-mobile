import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalForUnblockAccountOmComponent } from './modal-for-unblock-account-om.component';

describe('ModalForUnblockAccountOmComponent', () => {
  let component: ModalForUnblockAccountOmComponent;
  let fixture: ComponentFixture<ModalForUnblockAccountOmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalForUnblockAccountOmComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalForUnblockAccountOmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
