import { useContext } from 'react';
import CheckoutFormContext from '../../../../context/Form/CheckoutFormContext';

export default function useSagePaySuiteCheckoutFormContext() {
  return useContext(CheckoutFormContext);
}
