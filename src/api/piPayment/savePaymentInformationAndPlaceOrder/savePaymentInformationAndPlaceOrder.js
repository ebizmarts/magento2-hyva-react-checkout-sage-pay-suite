import modifier from './modifier';
import sendRequest from '../../../../../../api/sendRequest';
import { SAVE_PAYMENT_INFORMATION_PLACE_ORDER } from './mutation';

export default async function savePaymentInformationAndPlaceOrder(
  dispatch,
  data
) {
  const variables = {
    cartId: data.cartId,
    isGuestCustomer: data.isGuestCustomer,
    isJavaScriptEnabled: data.javascript_enabled,
    acceptHeader: data.acceptHeader,
    language: data.language,
    userAgent: data.userAgent,
    isJavaEnabled: data.isJavaEnabled,
    colorDepth: data.colorDepth,
    screenWidth: data.screenWidth,
    screenHeight: data.screenHeight,
    timeZone: data.timeZone,
    cardIdentifier: data.cardIdentifier,
    merchantSessionKey: data.merchantSessionKey,
    cardLastFour: data.cardLastFour,
    cardExpMonth: data.cardExpMonth,
    cardExpYear: data.cardExpYear,
    cardType: data.cardType,
    saveToken: data.saveToken,
    rusableToken: data.rusableToken,
  };

  return modifier(
    await sendRequest(dispatch, {
      query: SAVE_PAYMENT_INFORMATION_PLACE_ORDER,
      variables,
    })
  );
}
