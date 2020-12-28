/*
    Copyright 2020. Huawei Technologies Co., Ltd. All rights reserved.

    Licensed under the Apache License, Version 2.0 (the "License")
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

import { Injectable } from '@angular/core';
import { Plugin, Cordova, CordovaProperty, CordovaInstance, InstanceProperty, IonicNativePlugin } from '@ionic-native/core';
import { Observable } from 'rxjs';

@Plugin({
  pluginName: 'HmsAnalytics',
  plugin: 'cordova-plugin-hms-analytics',
  pluginRef: 'HMSAnalytics',
  platforms: ['Android','iOS']
})
@Injectable()
export class HMSAnalytics extends IonicNativePlugin {

  HAParamType = HAParamType;
  HAEventType = HAEventType;

  @Cordova({ otherPromise: true })
  setAnalyticsEnabled(enabled: boolean): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  config(): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  getAAID(): Promise<string> {
    return;
  }

  @Cordova({ otherPromise: true })
  onEvent(eventId: HAEventType | string, value: HAParamType | EventParams): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setUserId(userId: string): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setUserProfile(name: string, value: string): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  getUserProfiles(predefined: boolean): Promise<UserProfiles> {
    return;
  }
  
  @Cordova({ otherPromise: true })
  enableLog(): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  enableLogWithLevel(logLevel: Level): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setPushToken(token: string): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setMinActivitySessions(interval: number): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setSessionDuration(duration: number): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  clearCachedData(): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  pageStart(pageName: string, pageClassOverride: string): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  pageEnd(pageName: string): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  setReportPolicies(reportPolicyType: HAReportPolicy): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  enableLogger(): Promise<void> {
    return;
  }

  @Cordova({ otherPromise: true })
  disableLogger(): Promise<void> {
    return;
  }
}

export interface GenericObject {
  [key: string]: string;
}

export type UserProfiles = GenericObject;
export type EventParams = GenericObject;

export type Level = "DEBUG" | "INFO" | "WARN" | "ERROR";

export interface HAReportPolicy {
  "onScheduledTimePolicy"?: number
  "onAppLaunchPolicy"?: boolean
  "onMoveBackgroundPolicy"?: boolean
  "onCacheThresholdPolicy"?: number
}

export enum HAEventType {
  CREATEPAYMENTINFO = "$CreatePaymentInfo",
  ADDPRODUCT2CART = "$AddProduct2Cart",
  ADDPRODUCT2WISHLIST = "$AddProduct2WishList",
  STARTAPP = "$StartApp",
  STARTCHECKOUT = "$StartCheckout",
  VIEWCAMPAIGN = "$ViewCampaign",
  VIEWCHECKOUTSTEP = "$ViewCheckoutStep",
  WINVIRTUALCOIN = "$WinVirtualCoin",
  COMPLETEPURCHASE = "$CompletePurchase",
  OBTAINLEADS = "$ObtainLeads",
  JOINUSERGROUP = "$JoinUserGroup",
  COMPLETELEVEL = "$CompleteLevel",
  STARTLEVEL = "$StartLevel",
  UPGRADELEVEL = "$UpgradeLevel",
  SIGNIN = "$SignIn",
  SIGNOUT = "$SignOut",
  SUBMITSCORE = "$SubmitScore",
  CREATEORDER = "$CreateOrder",
  REFUNDORDER = "$RefundOrder",
  DELPRODUCTFROMCART = "$DelProductFromCart",
  SEARCH = "$Search",
  VIEWCONTENT = "$ViewContent",
  UPDATECHECKOUTOPTION = "$UpdateCheckoutOption",
  SHARECONTENT = "$ShareContent",
  REGISTERACCOUNT = "$RegisterAccount",
  CONSUMEVIRTUALCOIN = "$ConsumeVirtualCoin",
  STARTTUTORIAL = "$StartTutorial",
  COMPLETETUTORIAL = "$CompleteTutorial",
  OBTAINACHIEVEMENT = "$ObtainAchievement",
  VIEWPRODUCT = "$ViewProduct",
  VIEWPRODUCTLIST = "$ViewProductList",
  VIEWSEARCHRESULT = "$ViewSearchResult",
  UPDATEMEMBERSHIPLEVEL = "$UpdateMembershipLevel",
  FILTRATEPRODUCT = "$FiltrateProduct",
  VIEWCATEGORY = "$ViewCategory",
  UPDATEORDER = "$UpdateOrder",
  CANCELORDER = "$CancelOrder",
  COMPLETEORDER = "$CompleteOrder",
  CANCELCHECKOUT = "$CancelCheckout",
  OBTAINVOUCHER = "$ObtainVoucher",
  CONTACTCUSTOMSERVICE = "$ContactCustomService",
  RATE = "$Rate",
  INVITE = "$Invite"
}
export enum HAParamType {
  STORENAME = "$StoreName",
  BRAND = "$Brand",
  CATEGORY = "$Category",
  PRODUCTID = "$ProductId",
  PRODUCTNAME = "$ProductName",
  PRODUCTFEATURE = "$ProductFeature",
  PRICE = "$Price",
  QUANTITY = "$Quantity",
  REVENUE = "$Revenue",
  CURRNAME = "$CurrName",
  PLACEID = "$PlaceId",
  DESTINATION = "$Destination",
  ENDDATE = "$EndDate",
  BOOKINGDAYS = "$BookingDays",
  PASSENGERSNUMBER = "$PassengersNumber",
  BOOKINGROOMS = "$BookingRooms",
  ORIGINATINGPLACE = "$OriginatingPlace",
  BEGINDATE = "$BeginDate",
  TRANSACTIONID = "$TransactionId",
  CLASS = "$Class",
  CLICKID = "$ClickId",
  PROMOTIONNAME = "$PromotionName",
  CONTENT = "$Content",
  EXTENDPARAM = "$ExtendParam",
  MATERIALNAME = "$MaterialName",
  MATERIALSLOT = "$MaterialSlot",
  MEDIUM = "$Medium",
  SOURCE = "$Source",
  KEYWORDS = "$Keywords",
  OPTION = "$Option",
  STEP = "$Step",
  VIRTUALCURRNAME = "$VirtualCurrName",
  VOUCHER = "$Voucher",
  PLACE = "$Place",
  SHIPPING = "$Shipping",
  TAXFEE = "$TaxFee",
  USERGROUPID = "$UserGroupId",
  LEVELNAME = "$LevelName",
  RESULT = "$Result",
  ROLENAME = "$RoleName",
  LEVELID = "$LevelId",
  CHANNEL = "$Channel",
  SCORE = "$Score",
  SEARCHKEYWORDS = "$SearchKeywords",
  CONTENTTYPE = "$ContentType",
  ACHIEVEMENTID = "$AchievementId",
  FLIGHTNO = "$FlightNo",
  POSITIONID = "$PositionId",
  PRODUCTLIST = "$ProductList",
  ACOUNTTYPE = "$AcountType",
  OCCURREDTIME = "$OccurredTime",
  EVTRESULT = "$EvtResult",
  PREVLEVEL = "$PrevLevel",
  CURRVLEVEL = "$CurrvLevel",
  VOUCHERS = "$Vouchers",
  MATERIALSLOTTYPE = "$MaterialSlotType",
  LISTID = "$ListId",
  FILTERS = "$Filters",
  SORTS = "$Sorts",
  ORDERID = "$OrderId",
  PAYTYPE = "$PayType",
  REASON = "$Reason",
  EXPIREDATE = "$ExpireDate",
  VOUCHERTYPE = "$VoucherType",
  SERVICETYPE = "$ServiceType",
  DETAILS = "$Details",
  COMMENTTYPE = "$CommentType",
  REGISTMETHOD = "$RegistMethod"
}
