import React from 'react';

import PiForm from '../components/PiForm';
import Index from '../components/PiFormikProvider';
import { formikDataShape } from '../../../../../../utils/propTypes';

const PiMemorized = React.memo(({ formikData }) => (
  <Index formikData={formikData}>
    <PiForm />
  </Index>
));

PiMemorized.propTypes = {
  formikData: formikDataShape.isRequired,
};

export default PiMemorized;
