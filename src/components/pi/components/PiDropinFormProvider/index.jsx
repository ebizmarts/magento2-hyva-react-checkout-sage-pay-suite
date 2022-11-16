import React from 'react';

import { node } from 'prop-types';
import { formikDataShape } from '../../../../../../../utils/propTypes';
import PiDropinForm from '../PiDropinForm';
import PiFormikContext from '../../context/PiFormikContext';
import piConfig from '../../piConfig';

function PiDropinFormProvider({ children, formikData }) {
  const { method, selected, actions, isSelected } = formikData;

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  let context = {
    ...formikData,
    formikData,
  };

  context = {
    ...context,
    ...formikData,
    formikData,
    method,
    selected,
    actions,
    isSelected,
  };

  return (
    <PiFormikContext.Provider value={context}>
      <PiDropinForm id={piConfig.piPaymentForm}>{children}</PiDropinForm>
    </PiFormikContext.Provider>
  );
}

PiDropinFormProvider.propTypes = {
  children: node.isRequired,
  formikData: formikDataShape.isRequired,
};

export default PiDropinFormProvider;
