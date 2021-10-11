import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { NewServicesPage } from './new-services.page';

describe('NewServicesPage', () => {
  let component: NewServicesPage;
  let fixture: ComponentFixture<NewServicesPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewServicesPage],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: AppVersion,
          },
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

      fixture = TestBed.createComponent(NewServicesPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
