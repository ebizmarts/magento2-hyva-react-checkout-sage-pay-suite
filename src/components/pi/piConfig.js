import RootElement from '../../../../../utils/rootElement';

const piPaymentForm = 'sagepaysuitepi';

const config = RootElement.getPaymentConfig();
const sagePaySuiteConfig = config.ebizmarts_sagepaysuitepi;
const { dropin, licensed, mode, sca, newWindow, tokenEnabled, tokenCount } =
  sagePaySuiteConfig;
const sagePayTestUrl = 'https://pi-test.sagepay.com/api/v1/js/sagepay.js';
const sagePayLiveUrl = 'https://pi-live.sagepay.com/api/v1/js/sagepay.js';
const paymentConfig = {
  dropin,
  licensed,
  mode,
  sca,
  newWindow,
  tokenEnabled,
  tokenCount,
  piPaymentForm,
  destroySagePayInstance() {
    if (sagePaySuiteConfig.dropin) {
      if (
        typeof window.dropInInstance !== 'undefined' &&
        window.dropInInstance !== null
      ) {
        window.dropInInstance.destroy();
        window.dropInInstance = null;
      }
    }
  },
  getMaxTokensAmount() {
    return sagePaySuiteConfig.max_tokens;
  },
  getSagePayUrl() {
    return sagePaySuiteConfig.mode === 'live' ? sagePayLiveUrl : sagePayTestUrl;
  },
  isLiveMode() {
    return sagePaySuiteConfig.mode === 'live';
  },
  isValidLicense() {
    return sagePaySuiteConfig.licensed;
  },
};

export default paymentConfig;
