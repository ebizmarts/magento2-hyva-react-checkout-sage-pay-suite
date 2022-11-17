import { useCallback } from 'react';
import { get as _get, set as _set } from 'lodash-es';

import { __ } from '../../../../i18n';
import { performRedirect } from '../utility';
import { LOGIN_FORM } from '../../../../config';
import { _isObjEmpty } from '../../../../utils';
import useSagePaySuiteAppContext from './useSagePaySuiteAppContext';
import useSagePaySuiteCartContext from './useSagePaySuiteCartContext';
import { setPaymentMethodRequest } from '../../../../api';
import { placePiOrder } from '../api';
import piConfig from '../components/pi/piConfig';
import LocalStorage from '../../../../utils/localStorage';

export default function useSagePaySuitePiPerformPlaceOrder(paymentMethodCode) {
  const { cartId, setOrderInfo } = useSagePaySuiteCartContext();
  const { setPageLoader, appDispatch } = useSagePaySuiteAppContext();

  return useCallback(
    async (values, additionalData, extensionAttributes = {}) => {
      try {
        const merchantSessionKeyValue = `${additionalData.merchantSessionKey}`;
        const email = _get(values, `${LOGIN_FORM}.email`);
        const isLoggedIn = !!LocalStorage.getCustomerToken();
        const paymentMethodData = {
          paymentMethod: {
            method: paymentMethodCode,
            additional_data: additionalData,
          },
        };

        if (!_isObjEmpty(extensionAttributes)) {
          _set(paymentMethodData, 'paymentMethod.extension_attributes', {
            ...extensionAttributes,
          });
        }

        if (isLoggedIn) {
          _set(paymentMethodData, 'email', email);
        } else {
          _set(paymentMethodData, 'cartId', cartId);
        }

        setPageLoader(true);
        await setPaymentMethodRequest(appDispatch, paymentMethodCode);
        const data = {
          cartId: `${cartId}`,
          isGuestCustomer: !isLoggedIn,
          javascript_enabled: 1,
          acceptHeader: 'Accept headers.',
          language: navigator.language,
          userAgent: navigator.userAgent,
          isJavaEnabled: navigator.javaEnabled() ? 1 : 0,
          colorDepth: window.screen.colorDepth,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          timeZone: new Date().getTimezoneOffset(),
          cardIdentifier: `${additionalData.cardIdentifier}`,
          merchantSessionKey: `${merchantSessionKeyValue}`,
          cardLastFour: `${additionalData.cardLastFour}`,
          cardExpMonth: `${additionalData.cardExpMonth}`,
          cardExpYear: `${additionalData.cardExpYear}`,
          cardType: `${additionalData.cardType}`,
          saveToken: false,
          rusableToken: false,
        };
        const orderResponse = await placePiOrder(appDispatch, data);

        if (orderResponse.orderId) {
          setOrderInfo(orderResponse.orderId);
        }
        setPageLoader(false);
        const resultPerformRedirect = performRedirect(
          orderResponse,
          paymentMethodCode
        );
        if (
          typeof resultPerformRedirect !== 'undefined' &&
          resultPerformRedirect === 'string' &&
          resultPerformRedirect !== ''
        ) {
          return resultPerformRedirect;
        }
        return '';
      } catch (error) {
        piConfig.destroySagePayInstance();
        console.error(error);
        const errorMessage = __(
          'This transaction could not be performed. Please select another payment method.'
        );
        return errorMessage;
      }
    },
    [cartId, setOrderInfo, setPageLoader, appDispatch, paymentMethodCode]
  );
}
