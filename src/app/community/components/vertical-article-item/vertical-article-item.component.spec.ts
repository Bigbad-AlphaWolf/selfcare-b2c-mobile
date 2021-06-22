import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommunityService } from 'src/app/services/community-service/community.service';
import { PublicationDateFormatPipe } from 'src/shared/pipes/publication-date-format.pipe';

import { VerticalArticleItemComponent } from './vertical-article-item.component';

describe('VerticalArticleItemComponent', () => {
  let component: VerticalArticleItemComponent;
  let fixture: ComponentFixture<VerticalArticleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CommunityService,
          useValue: {
            getArticlesComments:() => {
              return of();
            }
          }
        }
      ],
      declarations: [ VerticalArticleItemComponent, PublicationDateFormatPipe ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerticalArticleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
