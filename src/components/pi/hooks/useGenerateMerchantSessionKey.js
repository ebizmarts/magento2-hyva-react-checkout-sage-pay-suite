import { useEffect } from 'react';
import { generateMerchantSessionKey } from '../../../api';
import useSagePaySuiteAppContext from '../../../hooks/useSagePaySuiteAppContext';
import useSagePaySuitePiPerformPlaceOrder from '../../../hooks/useSagePaySuitePiPerformPlaceOrder';
import piConfig from '../piConfig';

export async function afterTokenise(tokenisationResult, performPlaceOrder) {
  if (tokenisationResult.success) {
    const sageCardIdentifier = tokenisationResult.cardIdentifier;
    window.sageCardIdentifier = sageCardIdentifier;
    const { values } = window.values;
    const additionalData = {
      cardIdentifier: `${sageCardIdentifier}`,
      merchantSessionKey: `${window.merchantSessionKeyValue}`,
      cardLastFour: 0,
      cardExpMonth: 0,
      cardExpYear: 0,
      cardType: '',
    };
    await performPlaceOrder(values, additionalData);
  } else {
    console.error('tokenisation failed');
  }
}

function getPiDropinScript(url, merchantSessionKeyValue, performPlaceOrder) {
  const script = document.createElement('script');

  script.src = url;
  script.onload = () => {
    const dropInInstance = window.sagepayCheckout({
      merchantSessionKey: merchantSessionKeyValue,
      onTokenise(tokenisationResult) {
        afterTokenise(tokenisationResult, performPlaceOrder);
      },
    });
    window.dropInInstance = dropInInstance;
    window.dropInInstance.form();
  };

  document.body.appendChild(script);

  return () => {
    document.body.removeChild(script);
  };
}

const useGenerateMerchantSessionKey = (url, paymentMethodCode) => {
  const { setPageLoader, setErrorMessage } = useSagePaySuiteAppContext();
  const performPlaceOrder =
    useSagePaySuitePiPerformPlaceOrder(paymentMethodCode);

  return useEffect(() => {
    (async () => {
      let merchantSessionKeyValue = null;
      try {
        setPageLoader(true);
        const merchantSessionKey = await generateMerchantSessionKey();
        merchantSessionKeyValue = merchantSessionKey.response;
        await getPiDropinScript(
          url,
          merchantSessionKeyValue,
          performPlaceOrder
        );
        setPageLoader(false);
      } catch (error) {
        piConfig.destroySagePayInstance();
        setPageLoader(false);
        setErrorMessage(error);
      }
      window.merchantSessionKeyValue = merchantSessionKeyValue;
    })();
  }, [url, setPageLoader, setErrorMessage, performPlaceOrder]);
};

export default useGenerateMerchantSessionKey;
