import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateRequestOrTroubleTicketPage } from './create-request-or-trouble-ticket.page';

describe('CreateRequestOrTroubleTicketPage', () => {
  let component: CreateRequestOrTroubleTicketPage;
  let fixture: ComponentFixture<CreateRequestOrTroubleTicketPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateRequestOrTroubleTicketPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateRequestOrTroubleTicketPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
