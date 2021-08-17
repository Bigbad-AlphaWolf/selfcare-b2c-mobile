import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthenticationService } from '../services/authentication-service/authentication.service';

import { HomeV2Page } from './home-v2.page';

describe('HomeV2Page', () => {
  let component: HomeV2Page;
  let fixture: ComponentFixture<HomeV2Page>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeV2Page],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: ModalController,
          },
          {
            provide: AuthenticationService,
            useValue: {
              getMsisdnByNetwork: () => {
                return of();
              },
              confirmMsisdnByNetwork: () => {
                return of();
              },
              getSubscriptionForTiers: () => {
                return of();
              },
              getTokenFromBackend: () => {
                return of();
              },
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeV2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
