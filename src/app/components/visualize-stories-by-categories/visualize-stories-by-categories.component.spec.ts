import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VisualizeStoriesByCategoriesComponent } from './visualize-stories-by-categories.component';

describe('VisualizeStoriesByCategoriesComponent', () => {
  let component: VisualizeStoriesByCategoriesComponent;
  let fixture: ComponentFixture<VisualizeStoriesByCategoriesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizeStoriesByCategoriesComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VisualizeStoriesByCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
