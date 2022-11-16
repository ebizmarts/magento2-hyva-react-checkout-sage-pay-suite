import React, { useMemo } from 'react';
import { func, shape } from 'prop-types';

import PiMemorized from '../PiMemorized';
import PiDropin from '../PiDropin';
import piConfig from '../piConfig';
import useFormikMemorizer from '../../../../../../hook/useFormikMemorizer';
import { paymentMethodShape } from '../../../utility';
import useSagePaySuiteAppContext from '../../../hooks/useSagePaySuiteAppContext';
import { __ } from '../../../../../../i18n';

/**
 * Entry point of Pi payment section
 */
function Pi({ method, selected, actions }) {
  const sectionFormikData = useFormikMemorizer(piConfig.piPaymentForm);
  const { formSectionValues, formSectionErrors } = sectionFormikData;
  const isSelected = method.code === selected.code;
  const { setErrorMessage } = useSagePaySuiteAppContext();
  const piFormikData = useMemo(
    () => ({
      ...sectionFormikData,
      formSectionErrors,
      piValues: formSectionValues,
      method,
      selected,
      actions,
      isSelected,
    }),
    [
      sectionFormikData,
      formSectionValues,
      formSectionErrors,
      method,
      selected,
      actions,
      isSelected,
    ]
  );

  if (piConfig.isLiveMode && piConfig.isValidLicense()) {
    setErrorMessage(__('WARNING: Your Opayo Suite license is invalid.'));
  }

  if (piConfig.dropin) {
    return <PiDropin formikData={piFormikData} />;
  }
  if (!piConfig.dropin) {
    return <PiMemorized formikData={piFormikData} />;
  }
}

Pi.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Pi;
