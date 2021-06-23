import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';
import { BottomSheetService } from 'src/app/services/bottom-sheet/bottom-sheet.service';
import { FavorisService } from 'src/app/services/favoris/favoris.service';

import { FavoriteWoyofalComponent } from './favorite-woyofal.component';

describe('FavoriteWoyofalComponent', () => {
  let component: FavoriteWoyofalComponent;
  let fixture: ComponentFixture<FavoriteWoyofalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BottomSheetService
        },
        {
          provide: ModalController
        },
        {
          provide: FavorisService,
          useValue: {
            fetchFavorites:() => {
              return of();
            }
          }
        }
      ],
      declarations: [ FavoriteWoyofalComponent, CodeFormatPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteWoyofalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
