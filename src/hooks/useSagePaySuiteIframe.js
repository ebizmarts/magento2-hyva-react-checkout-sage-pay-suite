import { useCallback } from 'react';

export default function useSagePaySuiteIframe() {
  const loadIframe = useCallback(async () => {
    const form3Dv2 = window.piForm3Dv2;
    form3Dv2.setAttribute('target', `sagepaysuitepi-3Dsecure-iframe`);
    return form3Dv2.submit();
  }, []);

  return {
    loadIframe,
  };
}
