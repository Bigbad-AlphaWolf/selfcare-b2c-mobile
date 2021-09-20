import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { CommunicationHistoricComponent } from './communication-historic.component';

describe('CommunicationHistoricComponent', () => {
  let component: CommunicationHistoricComponent;
  let fixture: ComponentFixture<CommunicationHistoricComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CommunicationHistoricComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              },
            },
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CommunicationHistoricComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
