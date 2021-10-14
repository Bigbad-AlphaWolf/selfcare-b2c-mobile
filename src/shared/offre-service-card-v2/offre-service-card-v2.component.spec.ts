import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {UrlSerializer} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {HTTP} from '@ionic-native/http/ngx';
import {OffreServiceCardV2Component} from './offre-service-card-v2.component';
import {InAppBrowser} from '@ionic-native/in-app-browser/ngx';
import {MatBottomSheet, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {OverlayModule} from '@angular/cdk/overlay';

describe('OffreServiceCardV2Component', () => {
  let component: OffreServiceCardV2Component;
  let fixture: ComponentFixture<OffreServiceCardV2Component>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OffreServiceCardV2Component],
        imports: [IonicModule.forRoot(), HttpClientModule, OverlayModule, MatDialogModule],
        providers: [
          {
            provide: UrlSerializer,
            useValue: {}
          },
          {
            provide: HTTP,
            useValue: {}
          },
          {
            provide: InAppBrowser
          },
          {
            provide: MatBottomSheet
          },
          {
            provide: MatDialog
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(OffreServiceCardV2Component);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
