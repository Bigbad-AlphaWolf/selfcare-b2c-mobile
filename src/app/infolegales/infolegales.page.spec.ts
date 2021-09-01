import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfolegalesPage } from './infolegales.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('InfolegalesPage', () => {
  let component: InfolegalesPage;
  let fixture: ComponentFixture<InfolegalesPage>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [RouterTestingModule],
        declarations: [InfolegalesPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InfolegalesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
