import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularDelegate, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { KioskLocatorPopupComponent } from './kiosk-locator-popup.component';

describe('KioskLocatorPopupComponent', () => {
  let component: KioskLocatorPopupComponent;
  let fixture: ComponentFixture<KioskLocatorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KioskLocatorPopupComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [{ provide: AngularDelegate }, { provide: ModalController }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KioskLocatorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
