import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewPrepaidHybridDashboardPage } from './new-prepaid-hybrid-dashboard.page';

describe('NewPrepaidHybridDashboardPage', () => {
  let component: NewPrepaidHybridDashboardPage;
  let fixture: ComponentFixture<NewPrepaidHybridDashboardPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPrepaidHybridDashboardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewPrepaidHybridDashboardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
