import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { OmStatusVisualizationComponent } from './om-status-visualization.component';

describe('OmStatusVisualizationComponent', () => {
  let component: OmStatusVisualizationComponent;
  let fixture: ComponentFixture<OmStatusVisualizationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OmStatusVisualizationComponent],
        imports: [IonicModule.forRoot(), HttpClientModule, RouterTestingModule],
      }).compileComponents();

      fixture = TestBed.createComponent(OmStatusVisualizationComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
