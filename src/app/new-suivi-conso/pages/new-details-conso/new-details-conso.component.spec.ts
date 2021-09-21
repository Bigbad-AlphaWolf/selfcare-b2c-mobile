import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { NewDetailsConsoComponent } from './new-details-conso.component';

describe('NewDetailsConsoComponent', () => {
  let component: NewDetailsConsoComponent;
  let fixture: ComponentFixture<NewDetailsConsoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewDetailsConsoComponent],
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

      fixture = TestBed.createComponent(NewDetailsConsoComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
