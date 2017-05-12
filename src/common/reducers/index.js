import debug from 'debug';
import { combineReducers } from 'redux';

import clientReducers from './clientReducers';
import emptyObject from '../utils/emptyObject';

const log = debug('app:createReducer');
let systemReducers = {
    ...clientReducers,
};

if (process.env.TARGET === 'SERVER') {
    const serverDynamicBundles = require('./serverDynamicBundles').default; //eslint-disable-line
    const serverCriticalCSS = require('./serverCriticalCSS').default; //eslint-disable-line

    systemReducers = {
        ...systemReducers,
        serverDynamicBundles,
        serverCriticalCSS,
    };

    log('systemReducers', Object.keys(systemReducers));
}

const createReducer = (asyncReducers = emptyObject) => combineReducers({
    ...systemReducers,
    ...asyncReducers,
});

export default createReducer;
