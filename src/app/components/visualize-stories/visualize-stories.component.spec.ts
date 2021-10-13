import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { VisualizeStoriesComponent } from './visualize-stories.component';

describe('VisualizeStoriesComponent', () => {
  let component: VisualizeStoriesComponent;
  let fixture: ComponentFixture<VisualizeStoriesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [VisualizeStoriesComponent],
        imports: [IonicModule.forRoot(), SwiperModule],
        providers: [
          {
            provide: UrlSerializer,
            useValue: {},
          },
          {
            provide: InAppBrowser,
            useValue: {},
          },
          {
            provide: HttpClient,
            useValue: {},
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(VisualizeStoriesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
