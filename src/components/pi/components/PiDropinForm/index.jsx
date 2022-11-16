import React, { useCallback, useEffect, useState } from 'react';

import RadioInput from '../../../../../../../components/common/Form/RadioInput';
import useSagePaySuitePiFormikContext from '../../hooks/useSagePaySuitePiFormikContext';
import useGenerateMerchantSessionKey from '../../hooks/useGenerateMerchantSessionKey';
import { __ } from '../../../../../../../i18n';
import useSagePaySuitePi from '../../hooks/useSagePaySuitePi';
import useSagePaySuiteAppContext from '../../../../hooks/useSagePaySuiteAppContext';
import useSagePaySuiteCheckoutFormContext from '../../../../hooks/useSagePaySuiteCheckoutFormContext';
import PiModal from '../PiModal';
import piConfig from '../../piConfig';

function PiDropinForm() {
  const { formikData } = useSagePaySuitePiFormikContext();
  const { method, selected, actions } = formikData;
  const isSelected = method.code === selected.code;
  const { registerPaymentAction } = useSagePaySuiteCheckoutFormContext();
  const { handlePiDropinPlaceOrder, authorizeUser, checkProcessPaymentEnable } =
    useSagePaySuitePi(method.code);
  const { setErrorMessage } = useSagePaySuiteAppContext();
  const [showPiModal, setShowPiModal] = useState(false);

  /**
   * This will be fired when user placing the order and this payment method
   * is selected by the user.
   */
  const paymentSubmitHandler = useCallback(
    async (values) => {
      try {
        if (isSelected && authorizeUser() && checkProcessPaymentEnable()) {
          await handlePiDropinPlaceOrder(values);
        }
      } catch (error) {
        console.error(error);
        const messageError =
          typeof error === 'undefined' && error === ''
            ? __('Something went wrong, please select another payment method.')
            : error;
        setErrorMessage(messageError);
      }

      return false;
    },
    [
      checkProcessPaymentEnable,
      authorizeUser,
      setErrorMessage,
      isSelected,
      handlePiDropinPlaceOrder,
    ]
  );

  // registering this payment method so that it will be using the paymentSubmitHandler
  // to do the place order action in the case this payment method is selected.
  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [method, registerPaymentAction, paymentSubmitHandler]);

  if (!isSelected) {
    return (
      <RadioInput
        value={method.code}
        label={method.title}
        name="paymentMethod"
        checked={isSelected}
        onChange={actions.change}
      />
    );
  }

  return (
    <>
      <div className="mb-2">
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={actions.change}
        />
      </div>
      <div>
        <div>
          {/* eslint-disable */}
          {useGenerateMerchantSessionKey(piConfig.getSagePayUrl(), method.code)}
          {/* eslint-enable */}
        </div>
      </div>
      <form id="sagepaysuitepi-3DsecureV2-form" method="POST">
        <input type="hidden" name="creq" />
      </form>
      <input
        id="openSagePaySuitePiModal"
        onClick={() => setShowPiModal(true)}
        type="hidden"
      />
      <PiModal onClose={() => setShowPiModal(false)} show={showPiModal} />
    </>
  );
}

export default PiDropinForm;
