import React from 'react';

import PiDropinFormProvider from '../components/PiDropinFormProvider';
import { formikDataShape } from '../../../../../../utils/propTypes';

function PiDropin({ formikData }) {
  return (
    <div id="sp-container">
      <PiDropinFormProvider formikData={formikData} />
    </div>
  );
}

PiDropin.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default PiDropin;
