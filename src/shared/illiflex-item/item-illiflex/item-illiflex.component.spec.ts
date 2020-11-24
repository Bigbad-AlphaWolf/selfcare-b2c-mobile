import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIlliflexComponent } from './item-illiflex.component';

describe('ItemIlliflexComponent', () => {
  let component: ItemIlliflexComponent;
  let fixture: ComponentFixture<ItemIlliflexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemIlliflexComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIlliflexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
