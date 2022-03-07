import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UnblockMyAccountOmPage } from './unblock-my-account-om.page';

describe('UnblockMyAccountOmPage', () => {
  let component: UnblockMyAccountOmPage;
  let fixture: ComponentFixture<UnblockMyAccountOmPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UnblockMyAccountOmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UnblockMyAccountOmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
