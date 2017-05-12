import React from 'react';
import debug from 'debug';
import ReactDOM from 'react-dom';

import App from '../common/containers/App/App.jsx';
import initialStyles from '../common/assets/css/initial.css';
import configureStore from '../common/store/index';
import historyService from '../common/services/clientHistory';
import deviceInfoService from '../common/services/deviceInfo';
import windowSizeService from '../common/services/windowSize';
import removeDOMElementById from '../common/utils/removeDOMElementById';
import rootSagas from '../common/sagas/index';

const log = debug('app:client');

const cleanUpHeader = () => ['initialState', 'checkES6Features', 'criticalCss'].forEach(removeDOMElementById);
const rootElement = document.getElementById('app');
const store = configureStore(window.STATE);
const startServices = () => {
    // запускаем мониторинг изменения location, windowSize и ретранслируем его в state
    log('start app services...');
    historyService(store);
    windowSizeService(store);
    deviceInfoService(store);
};

window.addEventListener('load', () => {
    startServices();

    if (process.env.NODE_ENV === 'production') {
        // registering seviceWorker
        require('serviceworker-webpack-plugin/lib/runtime').register(); // eslint-disable-line global-require
    }
}, false);

// запускаем клиентские саги
const task = store.runSaga(rootSagas);

task.done.then(() => console.log('clients task is done'));

if (process.env.NODE_ENV === 'development') {
    window.debug = debug;

    const cleanUp = () => {
        cleanUpHeader();
        log('Client is starting...');
    };

    const AppContainer = require('react-hot-loader').AppContainer; // eslint-disable-line

    const renderAppDev = () => {
        initialStyles.use();
        ReactDOM.render(
            <AppContainer>
                <App store={store} />
            </AppContainer>,
            rootElement,
            cleanUp,
        );
    };

    // Hot Reloading
    if (module.hot) {
        module.hot.accept('../common/containers/App/App.jsx', () => {
            ReactDOM.render(
                <AppContainer>
                    <App store={store} />
                </AppContainer>,
                rootElement,
                cleanUp,
            );
        });
    }

    renderAppDev();
}


if (process.env.NODE_ENV === 'production') {
    // configure Zousan promise object
    Promise.suppressUncaughtRejectionError = true;

    const cleanUp = () => {
        // удаляем за ненадобностью стейт
        delete window.STATE;
        // удаляем глобальную переменную Zousan
        delete window.Zousan;
        cleanUpHeader();
    };

    const renderApp = () => {
        initialStyles.use();
        ReactDOM.render(<App store={store} />, rootElement, cleanUp);
    };

    renderApp();
}
