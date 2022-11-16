import { useContext } from 'react';

import AppContext from '../../../../context/App/AppContext';

export default function useSagePaySuiteAppContext() {
  const [appData, appActions] = useContext(AppContext);
  const { dispatch: appDispatch } = appActions;
  const { setErrorMessage, setPageLoader, isLoggedIn } = appActions;

  return {
    ...appData,
    ...appActions,
    appDispatch,
    isLoggedIn,
    setPageLoader,
    setErrorMessage,
  };
}
