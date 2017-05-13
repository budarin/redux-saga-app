import debug from 'debug';

import createSagaMiddleware, { END } from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';

import createReducer from '../reducers/index';

const log = debug('app:store');

const configureStore = (preloadedState = {}) => {  // eslint-disable-line max-statements
    let store = {};
    const sagaMiddleware = createSagaMiddleware();

    const configureMiddleware = () => {
        let middleware;

        log('start configureMiddleware');

        if (process.env.NODE_ENV === 'production') {
            middleware = applyMiddleware();
        }

        // в девелоп режиме добавляем логирование
        if (process.env.NODE_ENV === 'development') {
            const createLogger = require('redux-logger').createLogger; //eslint-disable-line
            const logger = createLogger({ collapsed: false });

            if (process.env.TARGET === 'CLIENT') {
                middleware = applyMiddleware(
                    sagaMiddleware,
                    logger,
                );
            }

            if (process.env.TARGET === 'SERVER') {
                middleware = applyMiddleware(
                    sagaMiddleware,
                    // logger,
                );
            }
        }

        return middleware;
    };

    const cleanUpStore = () => {
        store = {};
        store.init = undefined;
        store.runSaga = undefined;
        store.close = undefined;
        store.injectReducer = undefined;
        store.ejectReducer = undefined;
        store.injectSagas = undefined;
        store.ejectSagas = undefined;
        store.getRunningSagas = undefined;
    };

    store = createStore(createReducer(), preloadedState, configureMiddleware());

    store.runSaga = sagaMiddleware.run;

    store.close = () => {
        store.dispatch(END);
        cleanUpStore();
        log('close');
    };

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers/index', () => {
            //eslint-disable-next-line
            const nextRootReducer = require('../reducers/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
};

export default configureStore;
