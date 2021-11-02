import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';
import { IonicModule } from '@ionic/angular';

import { MsisdnAssistanceModalComponent } from './msisdn-assistance-modal.component';

describe('MsisdnAssistanceModalComponent', () => {
  let component: MsisdnAssistanceModalComponent;
  let fixture: ComponentFixture<MsisdnAssistanceModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [MsisdnAssistanceModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          { provide: WifiWizard2, useValue: {} },
          { provide: Network, useValue: {} },
          { provide: OpenNativeSettings, useValue: {} },
          { provide: HttpClient, useValue: {} },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(MsisdnAssistanceModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
