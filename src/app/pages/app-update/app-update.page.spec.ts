import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Market } from '@ionic-native/market/ngx';

import { AppUpdatePage } from './app-update.page';

describe('AppUpdatePage', () => {
  let component: AppUpdatePage;
  let fixture: ComponentFixture<AppUpdatePage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [AppUpdatePage],
        providers: [
          {
            provide: Market,
          },
          {
            provide: Location,
          },
          {
            provide: UrlSerializer,
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
