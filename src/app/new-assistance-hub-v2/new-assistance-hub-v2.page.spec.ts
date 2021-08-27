import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewAssistanceHubV2Page } from './new-assistance-hub-v2.page';

describe('NewAssistanceHubV2Page', () => {
  let component: NewAssistanceHubV2Page;
  let fixture: ComponentFixture<NewAssistanceHubV2Page>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAssistanceHubV2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewAssistanceHubV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
