import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRattachedNumberComponent } from './item-rattached-number.component';

describe('RattachedNumberComponent', () => {
  let component: ItemRattachedNumberComponent;
  let fixture: ComponentFixture<ItemRattachedNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemRattachedNumberComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRattachedNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
