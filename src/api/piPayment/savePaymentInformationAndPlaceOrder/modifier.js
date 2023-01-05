import { get as _get } from 'lodash-es';

export default function savePaymentInformationAndPlaceOrderModifier(result) {
  const success = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.success'
  );
  const errorMessage = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.error_message'
  );
  const response = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.response'
  );
  const status = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.status'
  );
  const transactionId = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.transaction_id'
  );
  const orderId = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.order_id'
  );
  const quoteId = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.quote_id'
  );
  const acsUrl = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.acs_url'
  );
  const creq = _get(result, 'data.savePaymentInformationAndPlaceOrder.creq');
  const redirectToFailureUrl = _get(
    result,
    'data.savePaymentInformationAndPlaceOrder.redirect_to_failure_url'
  );

  return {
    status,
    transactionId,
    orderId,
    quoteId,
    acsUrl,
    creq,
    success,
    errorMessage,
    response,
    redirectToFailureUrl,
  };
}
