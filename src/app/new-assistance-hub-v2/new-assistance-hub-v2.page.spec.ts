import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { NewAssistanceHubV2Page } from './new-assistance-hub-v2.page';

describe('NewAssistanceHubV2Page', () => {
  let component: NewAssistanceHubV2Page;
  let fixture: ComponentFixture<NewAssistanceHubV2Page>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [NewAssistanceHubV2Page],
        imports: [IonicModule.forRoot(), RouterTestingModule],
        providers: [
          {
            provide: AppVersion,
            useValue: {},
          },
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              },
            },
          },
          {
            provide: InAppBrowser,
            useValue: {},
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(NewAssistanceHubV2Page);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
