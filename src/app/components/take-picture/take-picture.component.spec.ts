import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakePictureComponent } from './take-picture.component';

describe('TakePictureComponent', () => {
  let component: TakePictureComponent;
  let fixture: ComponentFixture<TakePictureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakePictureComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
