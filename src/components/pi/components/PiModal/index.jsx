import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import useSagePaySuiteIframe from '../../../../hooks/useSagePaySuiteIframe';

const PiModal = (props) => {
  const { show } = props;
  const { loadIframe } = useSagePaySuiteIframe();
  const piFrame = document.getElementById('sagepaysuitepi-3Dsecure-iframe');

  useEffect(() => {
    if (piFrame !== null) {
      loadIframe();
    }
  }, [piFrame, loadIframe]);

  if (!show) {
    return '';
  }

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-10 overflow-y-auto"
      style={{
        backgroud: '#FFFFFF',
        flex: 'auto',
        top: 0,
        outline: 'none',
        right: 0,
        bottom: 0,
        zIndex: 9999,
        position: 'fixed',
      }}
    >
      <div
        style={{
          height: '100%',
          marginLeft: '5%',
          alignItems: 'center',
          textAlign: 'center',
          flex: 'auto',
        }}
      >
        <div
          style={{
            flex: 'auto',
            height: '100%',
            background: '#FFFFFF',
            paddingTop: '40px',
          }}
        >
          <h1
            className="text-lg font-medium leading-6 text-gray-900"
            id="modal-title"
            style={{
              background: '#FFFFFF',
              fontSize: '40px',
              marginBottom: '40px',
              position: 'absolute',
              paddingLeft: '20px',
              flex: 'auto',
            }}
          >
            Opayo 3D Secure Authentication
          </h1>
          <iframe
            title="Opayo 3D Secure Authentication"
            id="sagepaysuitepi-3Dsecure-iframe"
            name="sagepaysuitepi-3Dsecure-iframe"
            style={{
              width: '100%',
              height: '100%',
              alignItems: 'center',
              textAlign: 'center',
              flex: 'auto',
              paddingTop: '40px',
            }}
          />
        </div>
      </div>
    </div>,
    document.getElementById('react-checkout')
  );
};

export default PiModal;
