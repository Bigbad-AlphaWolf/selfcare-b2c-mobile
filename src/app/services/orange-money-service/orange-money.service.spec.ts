import { TestBed, inject } from '@angular/core/testing';

import { OrangeMoneyService } from './orange-money.service';
import {
	HttpTestingController,
	HttpClientTestingModule
} from '@angular/common/http/testing';

describe( 'OrangeMoneyService', () => {
	beforeEach( () => {
		TestBed.configureTestingModule( {
			imports: [HttpClientTestingModule],
			providers: [OrangeMoneyService]
		} );
	} );
	it( 'should be created', inject(
		[OrangeMoneyService],
		( service: OrangeMoneyService ) => {
			expect( service ).toBeDefined();
		}
	) );

	function setup() {
		const service = TestBed.get( OrangeMoneyService );
		const httpTestingController = TestBed.get( HttpTestingController );
		return { service, httpTestingController };
	}

	// it('when log event with Follow Analytics and operation is undefined key should be and valuoe should be', () => {
	//   const res = { status_code: 200 };
	//   window['FollowAnalytics'] = {
	//     logError() {},
	//     logEvent() {}
	//   };
	//   const { service, httpTestingController } = setup();
	//   const dataToLog = {
	//     operation: undefined,
	//     phoneNumber: '123456789',
	//     creditToBuy: {},
	//     passToBuy: {}
	//   };
	//   service.logWithFollowAnalytics(res, 'event', dataToLog);
	//   expect(service.getEventKey()).toEqual('Voir_solde_OM_dashboard_success');
	//   expect(service.getLogValue()).toEqual(200);
	// });

	// it('when log event with Follow Analytics and operation is CHECK_SOLDE key should be Recharge_Voir_Solde_OM_Success and value should be ', () => {
	//   const dataToLog = {
	//     operation: 'CHECK_SOLDE',
	//     phoneNumber: '123456789',
	//     creditToBuy: {},
	//     passToBuy: {}
	//   };
	//   const res = { status_code: 200 };
	//   window['FollowAnalytics'] = {
	//     logError() {},
	//     logEvent() {}
	//   };
	//   const { service, httpTestingController } = setup();
	//   service.logWithFollowAnalytics(res, 'event', dataToLog);
	//   expect(service.getEventKey()).toEqual('Recharge_Voir_Solde_OM_Success');
	//   expect(service.getLogValue()).toEqual(200);
	// });

	// it('when log event with Follow Analytics and operation is BUY_CREDIT key should be Recharge_Voir_Solde_OM_Success and value should be ', () => {
	//   const dataToLog = {
	//     operation: 'BUY_CREDIT',
	//     phoneNumber: '123456789',
	//     creditToBuy: {},
	//     passToBuy: {}
	//   };
	//   const res = { status_code: 200 };
	//   window['FollowAnalytics'] = {
	//     logError() {},
	//     logEvent() {}
	//   };
	//   const { service, httpTestingController } = setup();
	//   service.logWithFollowAnalytics(res, 'event', dataToLog);
	//   expect(service.getEventKey()).toEqual('Recharge_OM_Success');
	//   expect(service.getLogValue()).toEqual({ msisdn: dataToLog.phoneNumber });
	// });

	// it('when log event with Follow Analytics and operation is PASS_INTERNET key should be Recharge_Voir_Solde_OM_Success and value should be ', () => {
	//   const dataToLog = {
	//     operation: 'PASS_INTERNET',
	//     phoneNumber: '123456789',
	//     creditToBuy: {},
	//     passToBuy: {
	//       pass: { nom: 'Pass 100', tarif: '100', price_plan_index: '45124' },
	//       destinataire: '781210011'
	//     }
	//   };
	//   const res = { status_code: 200 };
	//   const valueFollow = {
	//     option_name: dataToLog.passToBuy.pass.nom,
	//     amount: dataToLog.passToBuy.pass.tarif,
	//     plan: dataToLog.passToBuy.pass.price_plan_index
	//   };
	//   window['FollowAnalytics'] = {
	//     logError() {},
	//     logEvent() {}
	//   };
	//   const { service, httpTestingController } = setup();
	//   service.logWithFollowAnalytics(res, 'event', dataToLog);
	//   expect(service.getEventKey()).toEqual('OM_Buy_Pass_Internet_Success');
	//   expect(service.getLogValue()).toEqual(valueFollow);
	// });
} );
