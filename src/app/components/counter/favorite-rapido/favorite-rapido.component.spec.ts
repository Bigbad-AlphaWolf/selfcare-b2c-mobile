import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { CodeFormatPipe } from 'src/app/pipes/code-format/code-format.pipe';

import { FavoriteRapidoComponent } from './favorite-rapido.component';

describe('FavoriteRapidoComponent', () => {
  let component: FavoriteRapidoComponent;
  let fixture: ComponentFixture<FavoriteRapidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ModalController
        }
      ],
      declarations: [ FavoriteRapidoComponent, CodeFormatPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteRapidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
