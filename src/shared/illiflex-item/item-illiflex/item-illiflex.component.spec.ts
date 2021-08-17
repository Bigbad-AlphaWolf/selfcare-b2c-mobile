import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataVolumePipe } from 'src/shared/pipes/data-volume.pipe';
import { IlliflexVoicePipe } from 'src/shared/pipes/illiflex-voice.pipe';

import { ItemIlliflexComponent } from './item-illiflex.component';

describe('ItemIlliflexComponent', () => {
  let component: ItemIlliflexComponent;
  let fixture: ComponentFixture<ItemIlliflexComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          ItemIlliflexComponent,
          DataVolumePipe,
          IlliflexVoicePipe,
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIlliflexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
