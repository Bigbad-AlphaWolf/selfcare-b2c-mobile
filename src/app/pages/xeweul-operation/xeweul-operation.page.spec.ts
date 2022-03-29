import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {RouterTestingModule} from '@angular/router/testing';
import {of} from 'rxjs';
import {BottomSheetService} from 'src/app/services/bottom-sheet/bottom-sheet.service';

import {XeweulOperationPage} from './xeweul-operation.page';

describe('XeweulOperationPage', () => {
  let component: XeweulOperationPage;
  let fixture: ComponentFixture<XeweulOperationPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [XeweulOperationPage],
        imports: [RouterTestingModule],
        providers: [
          {
            provide: MatBottomSheet
          },
          {
            provide: BottomSheetService,
            useValue: {
              initBsModal: () => {
                return of();
              },
              openModal: () => {
                return '';
              }
            }
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(XeweulOperationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
