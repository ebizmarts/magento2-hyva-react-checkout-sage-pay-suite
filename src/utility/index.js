import { shape, string } from 'prop-types';
import piConfig from '../components/pi/piConfig';
import { __ } from '../../../../i18n';
import { config } from '../../../../config';

export const paymentMethodShape = shape({ title: string, code: string });

function sagePayIsMobile() {
  return (
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/iPad/i)
  );
}

function threeDNewWindowEnabled() {
  return piConfig.newWindow === 1 || piConfig.newWindow === '1';
}

function isValidTransactionId(transactionId) {
  return (
    typeof transactionId !== 'undefined' &&
    transactionId !== null &&
    transactionId !== 'NA'
  );
}

function shouldRedirect(response) {
  return (
    isValidTransactionId(response.transaction_id) &&
    response.quote_id &&
    response.error_message
  );
}

function shouldRedirectToCart(redirectToFailureUrl) {
  return (
    typeof redirectToFailureUrl !== 'undefined' && redirectToFailureUrl !== null
  );
}

export function performRedirect(response, paymentCode) {
  let errorMessage = '';
  let redirectToCreateOrderForFailedTransaction = `${config.baseUrl}/sagepaysuite/pi/createOrderForFailedTransaction`;
  if (response.success) {
    if (response.status === 'Ok') {
      window.location.replace(`${config.baseUrl}/checkout/onepage/success/`);
    } else if (response.status === '3DAuth') {
      /**
       * 3D secure authentication required
       */
      if (typeof response.parEq === 'undefined' || response.parEq === null) {
        const form3Dv2 = document.getElementById(
          `${paymentCode}-3DsecureV2-form`
        );
        form3Dv2.setAttribute('action', response.acsUrl);
        form3Dv2.elements[0].setAttribute('value', response.creq);

        if (!sagePayIsMobile() && !threeDNewWindowEnabled()) {
          const openSagePaySuitePiModal = document.getElementById(
            'openSagePaySuitePiModal'
          );
          openSagePaySuitePiModal.click();
          window.piForm3Dv2 = form3Dv2;
        } else {
          form3Dv2.submit();
        }
      } else {
        errorMessage = __(
          'Invalid Opayo response, please use another payment method.'
        );
      }
    } else {
      errorMessage = __(
        'Invalid Opayo response, please use another payment method.'
      );
    }
  } else if (shouldRedirectToCart(response.redirect_to_failure_url)) {
    piConfig.destroySagePayInstance();
    window.location.href = response.redirect_to_failure_url;
  } else if (shouldRedirect(response)) {
    piConfig.destroySagePayInstance();
    redirectToCreateOrderForFailedTransaction += `?transactionId=${response.transactionId}&quoteId=${response.quoteId}&errorMessage=${response.errorMessage}`;
    window.location.href = redirectToCreateOrderForFailedTransaction;
  } else {
    errorMessage = response.errorMessage;
    piConfig.destroySagePayInstance();
    redirectToCreateOrderForFailedTransaction += `?transactionId=${response.transactionId}&quoteId=${response.quoteId}&errorMessage=${response.errorMessage}`;
    window.location.href = redirectToCreateOrderForFailedTransaction;
  }
  return errorMessage;
}
