import { useContext } from 'react';

import { PaymentMethodFormContext } from '../../../../components/paymentMethod/context';

export default function useSagePaySuitePaymentMethodContext() {
  return useContext(PaymentMethodFormContext);
}
