import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuiviConsoLigneComponent } from './suivi-conso-ligne.component';

describe('SuiviConsoLigneComponent', () => {
  let component: SuiviConsoLigneComponent;
  let fixture: ComponentFixture<SuiviConsoLigneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SuiviConsoLigneComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuiviConsoLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
