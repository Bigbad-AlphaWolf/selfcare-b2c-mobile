// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // SERVER_API_URL: 'https://orangeetmoi.orange.sn',
  // SERVER_API_URL: 'http://10.137.52.32:8712',
  SERVER_API_URL: "https://espaceclientv2.orangebusiness.sn",
  // SERVER_API_URL: 'http://10.137.52.31:8712',
  OM_URL: 'https://appom.orange-sonatel.com',
  SEDDO_SERVICE: 'selfcare-b2c-seddo',
  CONSO_SERVICE: 'selfcare-b2c-conso',
  SERVICES_SERVICE: 'selfcare-b2c-services',
  ACCOUNT_MNGT_SERVICE: 'selfcare-b2c-account-management',
  FILE_SERVICE: 'selfcare-file-manager',
  BILL_SERVICE: 'selfcare-b2c-facture',
  B2B_BILL_SERVICE: 'selfcare-facture',
  FACTURE_SERVICE: 'selfcare-b2c-facture',
  GATEWAY_SERVICE: 'selfcare-gateway',
  CODE_OTP_SERVICE: 'selfcare-otp',
  UAA_SERVICE: 'selfcare-uaa',
  OM_SERVICE: 'selfcare-b2c-om',
  SARGAL_SERVICE: 'selfcare-b2c-sargal',
  GA_CONFIG: {
    trackingId: 'UA-92621294-1',
    trackPageviews: true
  },
  GET_MSISDN_BY_NETWORK_URL: 'http://10.100.99.116:1494/api/v1/get-msisdn',
  CONFIRM_MSISDN_BY_NETWORK_URL:
    'http://10.100.99.116:1494/api/v1/confirm-msisdn'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
