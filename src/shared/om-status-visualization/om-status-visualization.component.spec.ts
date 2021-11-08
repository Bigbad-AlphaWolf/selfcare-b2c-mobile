import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';
import { OrangeMoneyService } from 'src/app/services/orange-money-service/orange-money.service';

import { OmStatusVisualizationComponent } from './om-status-visualization.component';

describe('OmStatusVisualizationComponent', () => {
  let component: OmStatusVisualizationComponent;
  let fixture: ComponentFixture<OmStatusVisualizationComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OmStatusVisualizationComponent],
        imports: [IonicModule.forRoot(), HttpClientModule, RouterTestingModule],
        providers: [
          {
            provide: OrangeMoneyService,
            useValue: {
              getOmMsisdn: () => {
                return of('787777777');
              },
              getUserStatus: () => {
                return of({
                  operation: 'FULL',
                  operationStatus: 'COMPLETED',
                  message: 'Votre operation est traitee avec succes',
                  hmac: 'bfdaa49d13a5438d30c7ec84e365c91c90d384e47c0e51e9681fd1631d8a300f',
                });
              },
            },
          },
        ],
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
