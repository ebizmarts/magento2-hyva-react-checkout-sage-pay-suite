import React, { useCallback } from 'react';
import { string as YupString, number as YupNumber } from 'yup';
import { Form } from 'formik';
import { node } from 'prop-types';

import { __ } from '../../../../../../../i18n';
import piConfig from '../../piConfig';
import useFormSection from '../../../../../../../hook/useFormSection';
import { formikDataShape } from '../../../../../../../utils/propTypes';
import useEnterActionInForm from '../../../../../../../hook/useEnterActionInForm';
import PiFormikContext from '../../context/PiFormikContext';

const initialValues = {
  cardHolderNameField: '',
  cardNumberField: '',
  cardExpirationDateField: '',
  cardsSecurityCodeField: '',
};

const requiredMessage = __('%1 is required');

const initValidationSchema = {
  cardHolderNameField: YupString().required(requiredMessage),
  cardNumberField: YupNumber().required(requiredMessage),
  cardExpirationDateField: YupNumber().required(requiredMessage),
  cardsSecurityCodeField: YupNumber().required(requiredMessage),
};

function PiFormikProvider({ children, formikData }) {
  const {
    setFieldValue,
    setFieldTouched,
    setFieldError,
    method,
    selected,
    actions,
    isSelected,
  } = formikData;
  const validationSchema =
    method.code === selected.code ? initValidationSchema : '';

  const resetPiFormFields = useCallback(() => {
    setFieldValue(piConfig.piPaymentForm, { ...initialValues });
    setFieldTouched(piConfig.piPaymentForm, {});
    setFieldError(piConfig.piPaymentForm, {});
  }, [setFieldValue, setFieldTouched, setFieldError]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  let context = {
    ...formikData,
    formikData,
    resetPiFormFields,
  };

  const handleKeyDown = useEnterActionInForm({
    formikData,
    validationSchema,
  });

  const formSectionContext = useFormSection({
    formikData,
    initialValues,
    validationSchema,
    id: piConfig.piPaymentForm,
  });

  context = {
    ...context,
    ...formikData,
    ...formSectionContext,
    formikData,
    handleKeyDown,
    resetPiFormFields,
    method,
    selected,
    actions,
    isSelected,
  };

  return (
    <PiFormikContext.Provider value={context}>
      <Form id={piConfig.piPaymentForm}>{children}</Form>
    </PiFormikContext.Provider>
  );
}

PiFormikProvider.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default PiFormikProvider;
