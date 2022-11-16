import { get as _get } from 'lodash-es';

export default function createMerchantSessionKeyModifier(result) {
  const success = _get(result, 'data.createMerchantSessionKey.success');
  const errorMessage = _get(
    result,
    'data.createMerchantSessionKey.error_message'
  );
  const response = _get(result, 'data.createMerchantSessionKey.response');

  return {
    success,
    errorMessage,
    response,
  };
}
