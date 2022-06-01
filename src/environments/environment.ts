// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // SERVER_API_URL: 'https://orangeetmoi.orange.sn',
  //SERVER_API_URL: 'https://espaceclientv2.orangebusiness.sn',
  SERVER_API_URL: 'http://selfcareb2c-client-http-dsidacdifdsorangeetmoi-dev.apps.malaaw-rec.orange-sonatel.com',
  // SERVER_API_URL: 'http://selfcareb2c-client-http-dsiselfcarebc-dev.k8s-test.orange-sonatel.com',
  // SERVER_API_URL: 'http://selfcareb2c-client-http-dsiselfcarebc-dev.k8s-test.orange-sonatel.com',
  // SERVER_API_URL: 'https://selfcare-client-dsiselfcarebcorangeetmoi-prod.apps.paas.orange-sonatel.com',
  OM_URL: 'https://appom.orange-sonatel.com',
  SEDDO_SERVICE: 'services/selfcare-b2c-seddo',
  CONSO_SERVICE: 'services/selfcare-b2c-conso',
  LOCAL_OM: 'http://localhost:8720',
  SERVICES_SERVICE: 'services/selfcare-b2c-services',
  ACCOUNT_MNGT_SERVICE: 'services/selfcare-b2c-account-management',
  FILE_SERVICE: 'services/selfcare-b2c-file-manager',
  BILL_SERVICE: 'services/selfcare-b2c-facture',
  B2B_BILL_SERVICE: 'services/selfcare-facture',
  FACTURE_SERVICE: 'services/selfcare-b2c-facture',
  GATEWAY_SERVICE: 'services/selfcare-gateway',
  OTP_SERVICE: 'services/selfcare-otp',
  UAA_SERVICE: 'services/selfcare-b2c-uaa',
  OM_SERVICE: 'services/selfcare-b2c-om',
  PURCHASES_SERVICE: 'services/selfcare-b2c-purchases',
  COMMUNITY_MANAGEMENT_SERVICE: 'services/selfcare-b2c-community-management',
  BOOSTER_SERVICE: 'services/selfcare-b2c-booster-management',
  SARGAL_SERVICE: 'services/selfcare-b2c-sargal',
  AUTH_IMPLICIT_MSISDN: '221775896287',
  GA_CONFIG: {
    trackingId: 'UA-92621294-1',
    trackPageviews: true,
  },
  // GET_MSISDN_BY_NETWORK_URL: 'https://appom.orange-sonatel.com:1490/api/v1/get-msisdn',
  // CONFIRM_MSISDN_BY_NETWORK_URL: 'https://appom.orange-sonatel.com:1490/api/v1/confirm-msisdn',
  GET_MSISDN_BY_NETWORK_URL: 'http://10.100.99.116:1494/api/v1/get-msisdn',
  CONFIRM_MSISDN_BY_NETWORK_URL: 'http://10.100.99.116:1494/api/v1/confirm-msisdn',
  DIMELO_CHAT_MARKUP: 'dimelo_chat_item_markup_95fb0f8745090d63e5acebaa',
  CUSTOMER_OFFER_CACHE_DURATION: 30 * 60 * 1000, // 1.800.000 ms = 1.800 s = 30 min subscription cache duration
  FAVORITE_PASS_CACHE_DURATION: 30 * 24 * 60 * 60 * 1000, // 30 Jrs
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
