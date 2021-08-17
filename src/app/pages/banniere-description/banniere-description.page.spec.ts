import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { BanniereService } from 'src/app/services/banniere-service/banniere.service';

import { BanniereDescriptionPage } from './banniere-description.page';

describe('BanniereDescriptionPage', () => {
  let component: BanniereDescriptionPage;
  let fixture: ComponentFixture<BanniereDescriptionPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BanniereDescriptionPage],
        providers: [
          {
            provide: ActivatedRoute,
          },
          {
            provide: ModalController,
          },
          {
            provide: BanniereService,
            useValue: {
              title: () => {},
              details: () => {},
              autre: () => {},
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BanniereDescriptionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
