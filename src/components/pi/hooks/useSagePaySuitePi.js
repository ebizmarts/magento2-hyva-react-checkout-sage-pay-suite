import { useCallback } from 'react';
import { get as _get } from 'lodash-es';

import useSagePaySuiteAppContext from '../../../hooks/useSagePaySuiteAppContext';
import useSagePaySuitePiPerformPlaceOrder from '../../../hooks/useSagePaySuitePiPerformPlaceOrder';

import { __ } from '../../../../../../i18n';
import { validate } from '../utility';
import useSagePaySuiteCartContext from '../../../hooks/useSagePaySuiteCartContext';
import piConfig from '../piConfig';
import usePaymentMethodCartContext from '../../../../../../components/paymentMethod/hooks/usePaymentMethodCartContext';
import { generateMerchantSessionKey } from '../../../api';

/* eslint-disable */
export default function useSagePaySuitePi(paymentMethodCode) {
  const { setErrorMessage, setPageLoader } = useSagePaySuiteAppContext();
  const performPlaceOrder =
    useSagePaySuitePiPerformPlaceOrder(paymentMethodCode);
  const { setPaymentMethod } = usePaymentMethodCartContext();
  const {
    hasCartBillingAddress,
    selectedShippingMethod,
    selectedPaymentMethod,
  } = useSagePaySuiteCartContext();
  const selectedShippingMethodCode = _get(selectedShippingMethod, 'methodCode');
  const selectedPaymentMethodCode = _get(selectedPaymentMethod, 'code');

  /*
   Check if is possible to proceed on placing the order.
   */
  const checkProcessPaymentEnable = useCallback(async () => {
    if (
      selectedShippingMethodCode &&
      ['', paymentMethodCode].includes(selectedPaymentMethodCode)
    ) {
      return true;
    }
    return false;
  }, [
    paymentMethodCode,
    selectedShippingMethodCode,
    selectedPaymentMethodCode,
  ]);

  /*
   Can place order
   */
  const authorizeUser = useCallback(async () => {
    if (!selectedShippingMethodCode || !hasCartBillingAddress) {
      setErrorMessage(__('Please complete all the required data.'));
    }
  }, [selectedShippingMethodCode, setErrorMessage, hasCartBillingAddress]);

  const getTokenForm = (values, merchantSessionKeyDataValue) => {
    const sagePaySuiteFormValues = values.sagepaysuitepi;
    const tokenForm = document.getElementById(`sagepaysuitepi-token-form`);
    tokenForm.elements[0].setAttribute('value', merchantSessionKeyDataValue);
    tokenForm.elements[1].setAttribute(
      'value',
      `${sagePaySuiteFormValues.cardHolderNameField}`
    );
    tokenForm.elements[2].setAttribute(
      'value',
      `${sagePaySuiteFormValues.cardNumberField}`
    );
    tokenForm.elements[3].setAttribute(
      'value',
      `${sagePaySuiteFormValues.cardExpirationDateField}`
    );
    tokenForm.elements[4].setAttribute(
      'value',
      `${sagePaySuiteFormValues.cardsSecurityCodeField}`
    );
    return tokenForm;
  };

  const getPiDropinScriptAndCardIdentifier = async (
    url,
    values,
    merchantSessionKeyDataValue
  ) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = () => {
      setPageLoader(true);
      const sagePayInstance = window.Sagepay;
      window.sagePayInstance = sagePayInstance;
      window.sagePayFormValues = values.sagepaysuitepi;
      const tokenForm = getTokenForm(values, merchantSessionKeyDataValue);
      window.sagePayInstance.tokeniseCardDetails(
        tokenForm,
        async function (status, response) {
          setPageLoader(true);
          if (status === 201) {
            window.sageCardType = response.cardType;
            window.sageCardIdentifier = response.cardIdentifier;

            const cardIdentifier = window.sageCardIdentifier;
            const cardType = window.sageCardType;
            if (
              typeof cardIdentifier !== 'undefined' &&
              typeof cardIdentifier === 'string' &&
              cardIdentifier !== null
            ) {
              const additionalAttributes = {
                cardIdentifier: `${cardIdentifier}`,
                merchantSessionKey: `${window.merchantSessionKeyValue}`,
                cardLastFour: `${window.sagePayFormValues.cardNumberField.slice(
                  -4
                )}`,
                cardExpMonth: `${window.sagePayFormValues.cardExpirationDateField.substring(
                  0,
                  2
                )}`,
                cardExpYear: `${window.sagePayFormValues.cardExpirationDateField.substring(
                  2,
                  4
                )}`,
                cardType: `${cardType}`,
              };
              const performPlaceOrderResult = await performPlaceOrder(
                values,
                additionalAttributes
              );
              if (
                typeof performPlaceOrderResult !== 'undefined' &&
                typeof performPlaceOrderResult === 'string' &&
                performPlaceOrderResult !== ''
              ) {
                setErrorMessage(performPlaceOrderResult);
              }
            }
          } else {
            let errorMessage = __(
              'Unable to initialize Opayo payment method, please use another payment method.'
            );
            let jsonResponse = null;
            if (response.responseJSON) {
              jsonResponse = response.responseJSON;
            }
            if (
              jsonResponse !== null &&
              jsonResponse.error &&
              jsonResponse.error.message
            ) {
              errorMessage = jsonResponse.error.message;
            } else if (
              jsonResponse !== null &&
              jsonResponse.errors &&
              jsonResponse.errors[0] &&
              jsonResponse.errors[0].clientMessage
            ) {
              errorMessage = jsonResponse.errors[0].clientMessage;
            } else if (
              response &&
              response.errors &&
              response.errors[0] &&
              response.errors[0].clientMessage
            ) {
              errorMessage = response.errors[0].clientMessage;
            }
            setPageLoader(false);
            setErrorMessage(errorMessage);
          }
          setPageLoader(false);
        }
      );
    };

    document.body.appendChild(script);
    setPageLoader(false);
    return () => {
      document.body.removeChild(script);
    };
  };

  const getMerchantSessionKeyAndCardIdentifier = async (url, values) => {
    setPageLoader(true);
    const merchantSessionKey = await generateMerchantSessionKey();
    const merchantSessionKeyDataValue = merchantSessionKey.response;
    window.merchantSessionKeyValue = merchantSessionKeyDataValue;
    window.sageValues = values;
    const resultMessage = await getPiDropinScriptAndCardIdentifier(
      url,
      values,
      merchantSessionKeyDataValue
    );
    setPageLoader(false);
    if (
      typeof resultMessage !== 'undefined' &&
      typeof resultMessage === 'string' &&
      resultMessage !== ''
    ) {
      throw resultMessage;
    }
  };

  const placeOrder = useCallback(
    async (response, values) => {
      setPageLoader(true);
      if (!piConfig.dropin) {
        const resultMessage = await getMerchantSessionKeyAndCardIdentifier(
          piConfig.getSagePayUrl(),
          values
        );
        if (
          typeof resultMessage !== 'undefined' &&
          typeof resultMessage === 'string' &&
          resultMessage !== ''
        ) {
          setPageLoader(false);
          return resultMessage;
        }
      } else {
        await setPaymentMethod(paymentMethodCode);
        window.values = values;
        await window.dropInInstance.tokenise();
      }
      setPageLoader(false);
    },
    [setPaymentMethod, setPageLoader, paymentMethodCode]
  );

  const handlePiPlaceOrder = useCallback(
    async (values) => {
      setPageLoader(true);
      const { isValid, message } = validate(values);

      if (isValid) {
        await placeOrder({}, values);
        setPageLoader(false);
        return true;
      }
      return message;
    },
    [placeOrder, setPageLoader]
  );

  const handlePiDropinPlaceOrder = useCallback(
    async (values) => {
      const resultPlaceOrder = await placeOrder({}, values);
      if (
        typeof resultPlaceOrder !== 'undefined' &&
        typeof resultPlaceOrder === 'string' &&
        resultPlaceOrder !== ''
      ) {
        return resultPlaceOrder;
      }
      return true;
    },
    [placeOrder]
  );

  return {
    handlePiDropinPlaceOrder,
    handlePiPlaceOrder,
    checkProcessPaymentEnable,
    authorizeUser,
  };
}
/* eslint-enable */
