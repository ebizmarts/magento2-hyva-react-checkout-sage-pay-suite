import React, { useEffect, useCallback, useState } from 'react';
import { get as _get } from 'lodash-es';

import Card from '../../../../../../../components/common/Card';
import RadioInput from '../../../../../../../components/common/Form/RadioInput';
import TextInput from '../../../../../../../components/common/Form/TextInput';
import { __ } from '../../../../../../../i18n';
import useSagePaySuitePiFormikContext from '../../hooks/useSagePaySuitePiFormikContext';
import useSagePaySuiteCheckoutFormContext from '../../../../hooks/useSagePaySuiteCheckoutFormContext';
import useSagePaySuitePi from '../../hooks/useSagePaySuitePi';
import useSagePaySuiteAppContext from '../../../../hooks/useSagePaySuiteAppContext';
import useSagePaySuiteCartContext from '../../../../hooks/useSagePaySuiteCartContext';
import usePaymentMethodCartContext from '../../../../../../../components/paymentMethod/hooks/usePaymentMethodCartContext';
import PiModal from '../PiModal';

function PiForm() {
  const { fields, formikData, handleKeyDown, resetPiFormFields } =
    useSagePaySuitePiFormikContext();
  const { method, selected, actions } = formikData;
  const isSelected = method.code === selected.code;
  const { registerPaymentAction } = useSagePaySuiteCheckoutFormContext();
  const { handlePiPlaceOrder, authorizeUser, checkProcessPaymentEnable } =
    useSagePaySuitePi(method.code);
  const { setPageLoader, setErrorMessage } = useSagePaySuiteAppContext();
  const { selectedPaymentMethod, isVirtualCart, doCartContainShippingAddress } =
    useSagePaySuiteCartContext();
  const methodCode = _get(method, 'code');
  const { setPaymentMethod } = usePaymentMethodCartContext();
  const [showPiModal, setShowPiModal] = useState(false);
  const paymentAvailable = isVirtualCart || doCartContainShippingAddress;

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
  const paymentSubmitHandler = useCallback(
    async (values) => {
      try {
        if (isSelected && authorizeUser() && checkProcessPaymentEnable()) {
          setPageLoader(true);
          const resultHandlePiPlaceOrder = await handlePiPlaceOrder(values);
          if (
            typeof resultHandlePiPlaceOrder !== 'undefined' &&
            typeof resultHandlePiPlaceOrder === 'string' &&
            resultHandlePiPlaceOrder !== ''
          ) {
            setPageLoader(false);
            setErrorMessage(resultHandlePiPlaceOrder);
          }
        }
      } catch (error) {
        resetPiFormFields();
        setPageLoader(false);
        setErrorMessage(
          __('Something went wrong, please select another payment method.')
        );
        return false;
      }
      setPageLoader(false);
      return true;
    },
    [
      handlePiPlaceOrder,
      checkProcessPaymentEnable,
      authorizeUser,
      setErrorMessage,
      isSelected,
      setPageLoader,
      resetPiFormFields,
    ]
  );

  // registering this payment method so that it will be using the paymentSubmitHandler
  // to do the place order action in the case this payment method is selected.
  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [method, registerPaymentAction, paymentSubmitHandler]);

  useEffect(() => {
    if (isSelected && selectedPaymentMethod.code !== methodCode) {
      (async () => {
        setPageLoader(true);
        await setPaymentMethod(methodCode);
        setPageLoader(false);
      })();
    }
  }, [
    isSelected,
    setPaymentMethod,
    methodCode,
    selectedPaymentMethod,
    setPageLoader,
  ]);

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        disabled={!paymentAvailable}
        name="paymentMethod"
        checked={isSelected}
        onChange={actions.change}
      />
    );
  }

  return (
    <div>
      <div className="mb-2">
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={actions.change}
        />
      </div>
      <Card bg="darker">
        <form action="">
          <TextInput
            className="mb-2"
            required
            name={fields.cardHolderNameField}
            label={__('Card Holder Name')}
            formikData={formikData}
            onKeyDown={handleKeyDown}
          />
          <TextInput
            required
            label={__('Credit Card Number')}
            name={fields.cardNumberField}
            formikData={formikData}
            placeholder="4929 0000 0000 6"
            onKeyDown={handleKeyDown}
          />
          <TextInput
            required
            label={__('Expiry')}
            name={fields.cardExpirationDateField}
            formikData={formikData}
            placeholder="MMYY"
            onKeyDown={handleKeyDown}
          />
          <TextInput
            required
            label={__('Card Verification Number')}
            name={fields.cardsSecurityCodeField}
            placeholder="123"
            formikData={formikData}
            onKeyDown={handleKeyDown}
          />
        </form>
      </Card>
      <form
        id="sagepaysuitepi-token-form"
        style={{ display: 'none' }}
        method="POST"
        action="/payment"
      >
        <input type="hidden" data-sagepay="merchantSessionKey" />
        <input type="text" data-sagepay="cardholderName" />
        <input type="text" data-sagepay="cardNumber" />
        <input type="text" data-sagepay="expiryDate" />
        <input type="text" data-sagepay="securityCode" />
      </form>
      <form id="sagepaysuitepi-3DsecureV2-form" method="POST">
        <input type="hidden" name="creq" />
      </form>
      <input
        id="openSagePaySuitePiModal"
        onClick={() => setShowPiModal(true)}
        type="hidden"
      />
      <PiModal onClose={() => setShowPiModal(false)} show={showPiModal} />
    </div>
  );
}

export default PiForm;
