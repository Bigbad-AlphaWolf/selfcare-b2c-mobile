import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { CommunityService } from 'src/app/services/community-service/community.service';

import { AllCategoriesModalComponent } from './all-categories-modal.component';

describe('AllCategoriesModalComponent', () => {
  let component: AllCategoriesModalComponent;
  let fixture: ComponentFixture<AllCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[
        {
          provide: ModalController
        },
        {
          provide: CommunityService,
          useValue: {
            getArticlesCategories:() => {
              return of()
            }
          }
        }
      ],
      declarations: [ AllCategoriesModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
