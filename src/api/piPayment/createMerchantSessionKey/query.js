export const CREATE_SESSION_MERCHANT_KEY = `
query {
  createMerchantSessionKey {
    success,
    error_message,
    response
  }
}
`;
