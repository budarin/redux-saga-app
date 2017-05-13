import debug from 'debug';
import { combineReducers } from 'redux';

import clientReducers from './clientReducers';
import emptyObject from '../utils/emptyObject';

const log = debug('app:createReducer');
let systemReducers = {
    ...clientReducers,
};

if (process.env.TARGET === 'SERVER') {
    systemReducers = {
        ...systemReducers,
    };

    log('systemReducers', Object.keys(systemReducers));
}

const createReducer = (asyncReducers = emptyObject) => combineReducers({
    ...systemReducers,
    ...asyncReducers,
});

export default createReducer;
