import getLocationInfo from '../utils/getLocationInfo';
import { historyChangedAction } from '../reducers/currentRouter';

export const getHistoryService = store => event => {
    store.dispatch(historyChangedAction(getLocationInfo()));
};

const historyService = store => {
    const dispatcher = getHistoryService(store);

    window.addEventListener('popstate', dispatcher);
    // dispatcher(); // инициализация клиентским url
};

export default historyService;
