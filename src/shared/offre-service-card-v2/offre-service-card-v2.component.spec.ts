import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OffreServiceCardV2Component } from './offre-service-card-v2.component';

describe('OffreServiceCardV2Component', () => {
  let component: OffreServiceCardV2Component;
  let fixture: ComponentFixture<OffreServiceCardV2Component>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OffreServiceCardV2Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OffreServiceCardV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
