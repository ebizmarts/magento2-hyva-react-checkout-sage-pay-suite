import createMerchantSessionKey from './piPayment/createMerchantSessionKey';
import savePaymentInformationAndPlaceOrder from './piPayment/savePaymentInformationAndPlaceOrder';

export const generateMerchantSessionKey = createMerchantSessionKey;
export const placePiOrder = savePaymentInformationAndPlaceOrder;
