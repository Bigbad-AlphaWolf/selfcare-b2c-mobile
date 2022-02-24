import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectIrtRecipientPopupComponent } from './select-irt-recipient-popup.component';

describe('SelectIrtRecipientPopupComponent', () => {
  let component: SelectIrtRecipientPopupComponent;
  let fixture: ComponentFixture<SelectIrtRecipientPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectIrtRecipientPopupComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectIrtRecipientPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
