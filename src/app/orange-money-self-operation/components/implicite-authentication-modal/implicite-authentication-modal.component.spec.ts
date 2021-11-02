import { HttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Network } from '@ionic-native/network/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { ImpliciteAuthenticationModalComponent } from './implicite-authentication-modal.component';

describe('ImpliciteAuthenticationModalComponent', () => {
  let component: ImpliciteAuthenticationModalComponent;
  let fixture: ComponentFixture<ImpliciteAuthenticationModalComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ImpliciteAuthenticationModalComponent],
        imports: [IonicModule.forRoot()],
        providers: [
          {
            provide: HttpClient,
            useValue: {
              get: () => {
                return of();
              },
            },
          },
          {
            provide: Network,
          },
          {
            provide: Uid,
          },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ImpliciteAuthenticationModalComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
