import { useCallback } from 'react';
import { generateMerchantSessionKey } from '../../../api';
import useSagePaySuiteAppContext from '../../../hooks/useSagePaySuiteAppContext';
import useSagePaySuitePiPerformPlaceOrder from '../../../hooks/useSagePaySuitePiPerformPlaceOrder';
import piConfig from '../piConfig';

export default function useGenerateMerchantSessionKey(url, paymentMethodCode) {
  const { setPageLoader, setErrorMessage } = useSagePaySuiteAppContext();
  const performPlaceOrder =
    useSagePaySuitePiPerformPlaceOrder(paymentMethodCode);

  const afterTokenise = useCallback(
    async (tokenisationResult) => {
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
    },
    [performPlaceOrder]
  );

  const initializeMerchantSessionKey = useCallback(async () => {
    setPageLoader(true);
    await generateMerchantSessionKey()
      .then((merchantSessionKey) => {
        window.merchantSessionKeyValue = merchantSessionKey.response;
        const script = document.createElement('script');

        script.src = url;
        script.onload = () => {
          const dropInInstance = window.sagepayCheckout({
            merchantSessionKey: window.merchantSessionKeyValue,
            onTokenise(tokenisationResult) {
              afterTokenise(tokenisationResult);
            },
          });
          window.dropInInstance = dropInInstance;
          window.dropInInstance.form();
        };

        document.body.appendChild(script);
      })
      .then(() => {
        setPageLoader(false);
      })
      .catch((error) => {
        piConfig.destroySagePayInstance();
        setPageLoader(false);
        setErrorMessage(error);
      });
  }, [afterTokenise, url, setErrorMessage, setPageLoader]);

  return {
    initializeMerchantSessionKey,
  };
}
