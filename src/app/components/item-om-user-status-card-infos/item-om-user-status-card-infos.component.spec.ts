import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {PhoneNumberDisplayPipe} from 'src/shared/pipes/phone-number-display.pipe';

import {ItemOmUserStatusCardInfosComponent} from './item-om-user-status-card-infos.component';

describe('ItemOmUserStatusCardInfosComponent', () => {
  let component: ItemOmUserStatusCardInfosComponent;
  let fixture: ComponentFixture<ItemOmUserStatusCardInfosComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [ItemOmUserStatusCardInfosComponent, PhoneNumberDisplayPipe],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemOmUserStatusCardInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
