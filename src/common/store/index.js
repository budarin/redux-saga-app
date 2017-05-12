import debug from 'debug';

import createSagaMiddleware, { END } from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';

import rootSagas from '../../common/sagas/index';
import emptyObject from '../utils/emptyObject';
import createReducer from '../reducers/index';

const log = debug('app:store');
const logReducers = debug('app:store:reducers');
const logSagas = debug('app:store:sagas');

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
        store.init();
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

    const rootTask = store.runSaga(rootSagas);

    store.init = () => {
        store.asyncReducers = {};
        store.asyncSagas = {};
    };

    store.close = () => {
        store.dispatch(END);
        cleanUpStore();
        log('close');
    };

    store.injectReducer = (asyncReducers = emptyObject) => {
        const keys = Object.keys(asyncReducers);
        const len = keys.length;

        for (let i = 0; i < len; i++) {
            const reducerName = keys[i];

            store.asyncReducers[reducerName] = asyncReducers[reducerName];
        }
        store.replaceReducer(createReducer(store.asyncReducers));
        logReducers('injectReducer', keys);
    };

    store.ejectReducer = (asyncReducers = emptyObject) => {
        const keys = Object.keys(asyncReducers);
        const len = keys.length;

        for (let i = 0; i < len; i++) {
            const reducerName = keys[i];

            delete store.asyncReducers[reducerName];
        }
        store.replaceReducer(createReducer(store.asyncReducers));
        logReducers('ejectReducer', keys);
    };

    store.injectSagas = (asyncSagas = emptyObject) => {
        const keys = Object.keys(asyncSagas);
        const len = keys.length;

        for (let i = 0; i < len; i++) {
            const sagaName = keys[i];
            const saga = asyncSagas[sagaName];

            if (!store.asyncSagas[sagaName]) {
                store.asyncSagas[sagaName] = store.runSaga(saga);
            }
        }
        logSagas('injectSagas', keys);
    };

    store.ejectSagas = (asyncSagas = emptyObject) => {
        const keys = Object.keys(asyncSagas);
        const len = keys.length;

        for (let i = 0; i < len; i++) {
            const sagaName = keys[i];
            const task = store.asyncSagas[sagaName];

            task.cancel();
            store.asyncSagas[sagaName] = undefined;
        }
        logSagas('ejectSagas', keys);
    };

    store.getRunningSagas = () => {
        const keys = Object.keys(store.asyncSagas);
        const len = keys.length;
        const runningSagas = [];

        if (rootTask.isRunning()) {
            // runningSagas.push(rootTask.done);
        }

        for (let i = 0; i < len; i++) {
            const sagaName = keys[i];
            const saga = store.asyncSagas[sagaName];

            if (saga && saga.isRunning()) {
                runningSagas.push(saga.done);
            }
        }

        logSagas('getRunningSagas', runningSagas);

        return runningSagas;
    };

    store.init();

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
