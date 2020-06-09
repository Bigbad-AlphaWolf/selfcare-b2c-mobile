import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTransferTypeComponent } from './choose-transfer-type.component';
import { DashboardService } from 'src/app/services/dashboard-service/dashboard.service';
import { of } from 'rxjs';

describe('ChooseTransferTypeComponent', () => {
  let component: ChooseTransferTypeComponent;
  let fixture: ComponentFixture<ChooseTransferTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseTransferTypeComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: DashboardService,
          useValue: {
            getUserConsoInfosByCode: () => {
              return of()
            }
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseTransferTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
