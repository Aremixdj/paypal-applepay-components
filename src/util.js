/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable flowtype/no-weak-types */
/* @flow */
import {
    getSDKQueryParam,
    getPayPalAPIDomain,
    getMerchantID
} from '@paypal/sdk-client/src';

import { ORDER_INTENT } from './constants';
import type { ConfigResponse, GQLConfigResponse } from './types';

export function getMerchantDomain() : string {
    const url = window.location.origin;
    return url.split('//')[1];
}

export function getCurrency() : string {
    return getSDKQueryParam('currency', 'USD');
}

export function getPayPalHost(customDomain : string) : any {
    const params = new URLSearchParams(document.location.search);
    if (params.get(customDomain)) {
        return params.get(customDomain);
    }
    return getPayPalAPIDomain().split('//')[1];
}

type CreateOrderPayLoad = {|
    purchase_units : $ReadOnlyArray<{| amount : {| currency_code : string, value : string|}|}>,
    intent : string,
    payer : any,
    application_context : any
|};

export function getCreateOrderPayLoad(requestPayLoad : any) : CreateOrderPayLoad {
    const merchant_id = getMerchantID();
    let { purchase_units, intent, payer, application_context } = requestPayLoad;
    purchase_units = purchase_units.map(purchaseUnit => {
        return {
            ...purchaseUnit,
            payee: (merchant_id && {
                merchant_id
            })
        };
    });

    return  {
        purchase_units,
        intent: intent || ORDER_INTENT.CAPTURE,
        payer,
        application_context

    };

}

 
export function  mapGetConfigResponse(applepayConfig : GQLConfigResponse) : ConfigResponse {
    return {
        ...applepayConfig,
        currencyCode: getCurrency(),
        countryCode:  applepayConfig.merchantCountry
    };
}


export class PayPalApplePayError extends Error {
    paypalDebugId: null | string;
    errorName: string;
    constructor(name : string, message : string, paypalDebugId : null | string) {
        super(message);
        this.name = 'PayPalApplePayError';
        this.errorName = name;
        this.paypalDebugId = paypalDebugId;
    }


}
