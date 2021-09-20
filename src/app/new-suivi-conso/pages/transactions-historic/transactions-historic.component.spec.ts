import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { TransactionsHistoricComponent } from './transactions-historic.component';

describe('TransactionsHistoricComponent', () => {
  let component: TransactionsHistoricComponent;
  let fixture: ComponentFixture<TransactionsHistoricComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TransactionsHistoricComponent],
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

      fixture = TestBed.createComponent(TransactionsHistoricComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
