import { useContext } from 'react';

import { PiFormikContext } from '../context';

export default function useSagePaySuitePiFormikContext() {
  return useContext(PiFormikContext);
}
