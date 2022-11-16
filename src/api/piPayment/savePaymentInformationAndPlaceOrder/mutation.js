export const PI_SCA_REQUEST_INPUT = `
  pi_sca_request_input: {
    javascript_enabled: $isJavaScriptEnabled
    accept_headers: $acceptHeader
    language: $language
    user_agent: $userAgent
    java_enabled: $isJavaEnabled
    color_depth: $colorDepth
    screen_width: $screenWidth
    screen_height: $screenHeight
    timezone: $timeZone
  }
`;

export const PI_REQUEST_GENERAL_INPUT = `
  pi_request_general_input: {
    card_identifier: $cardIdentifier
    merchant_session_key: $merchantSessionKey
    card_last_four: $cardLastFour
    card_exp_month: $cardExpMonth
    card_exp_year: $cardExpYear
    card_type: $cardType
    save_token: $saveToken
    reusable_token: $rusableToken
  }
`;

export const SAVE_PAYMENT_INFORMATION_PLACE_ORDER = `
  mutation (
    $cartId : String,
    $isGuestCustomer: Boolean,
    $isJavaScriptEnabled: Int,
    $acceptHeader: String,
    $language: String,
    $userAgent: String,
    $isJavaEnabled: Int,
    $colorDepth: Int,
    $screenWidth: Int,
    $screenHeight: Int,
    $timeZone: Int,
    $cardIdentifier: String,
    $merchantSessionKey: String,
    $cardLastFour: Int,
    $cardExpMonth: Int,
    $cardExpYear: Int,
    $cardType: String,
    $saveToken: Boolean,
    $rusableToken: Boolean
  ) {
        savePaymentInformationAndPlaceOrder(
        input: {
          cart_id: $cartId
          is_guest_customer: $isGuestCustomer
          ${PI_SCA_REQUEST_INPUT}
          ${PI_REQUEST_GENERAL_INPUT}
        }
    ) {
      status
      transaction_id
      order_id
      quote_id
      acs_url
      par_eq
      creq
      success
      error_message
      response
    }
  }
`;

export default SAVE_PAYMENT_INFORMATION_PLACE_ORDER;
