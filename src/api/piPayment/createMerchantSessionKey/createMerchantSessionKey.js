import sendRequest from '../../../../../../api/sendRequest';
import modifier from './modifier';
import { CREATE_SESSION_MERCHANT_KEY } from './query';

export default async function createMerchantSessionKey(dispatch, storeId) {
  const variables = { ...storeId };
  const output = modifier(
    await sendRequest(dispatch, {
      variables,
      query: CREATE_SESSION_MERCHANT_KEY,
    })
  );

  if (output.error) {
    throw new Error(output.error);
  }

  return output;
}
