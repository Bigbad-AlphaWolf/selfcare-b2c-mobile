import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';

import { ItemRechargeCreditComponent } from './item-recharge-credit.component';

describe('ItemRechargeCreditComponent', () => {
  let component: ItemRechargeCreditComponent;
  let fixture: ComponentFixture<ItemRechargeCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRechargeCreditComponent, FormatCurrencyPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRechargeCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
