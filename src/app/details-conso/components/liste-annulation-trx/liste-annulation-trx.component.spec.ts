import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListeAnnulationTrxComponent } from './liste-annulation-trx.component';

describe('ListeAnnulationTrxComponent', () => {
  let component: ListeAnnulationTrxComponent;
  let fixture: ComponentFixture<ListeAnnulationTrxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeAnnulationTrxComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListeAnnulationTrxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
