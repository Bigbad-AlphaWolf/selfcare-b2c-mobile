import { TestBed } from '@angular/core/testing';

import { ApplicationRoutingService } from './application-routing.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularDelegate } from '@ionic/angular';

describe('ApplicationRoutingService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AngularDelegate,
        {
          provide: Router,
          useValue: {},
        },
      ],
    })
  );

  it('should be created', () => {
    const service: ApplicationRoutingService = TestBed.get(
      ApplicationRoutingService
    );
    expect(service).toBeTruthy();
  });
});
