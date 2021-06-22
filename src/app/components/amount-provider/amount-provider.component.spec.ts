import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormatCurrencyPipe } from 'src/shared/pipes/format-currency.pipe';

import { AmountProviderComponent } from './amount-provider.component';

describe('SelectableAmountCardsComponent', () => {
  let component: AmountProviderComponent;
  let fixture: ComponentFixture<AmountProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmountProviderComponent, FormatCurrencyPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmountProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
