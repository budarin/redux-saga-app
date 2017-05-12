import { delay } from 'redux-saga';
import { put, takeEvery, fork } from 'redux-saga/effects';
import createAction from '../../../../utils/createAction';

// Constants
const SET = '@counter/SET';
const INCREMENT = '@counter/INC';
const DECREMENT = '@counter/DEC';
const ASYNC_INCREMENT = '@counter/INC_ASYNC';

export const counterActionTypes = {
    SET,
    INCREMENT,
    DECREMENT,
    ASYNC_INCREMENT,
};


// Action creators
const setCounter = createAction(INCREMENT, 'value');
const asyncIncrement = createAction(ASYNC_INCREMENT);
const increment = createAction(INCREMENT);
const decrement = createAction(DECREMENT);


// Actions - needed to bind to dispatcher at once
export const counterActions = {
    setCounter,
    asyncIncrement,
    increment,
    decrement,
};


// Sagas
function* incrementAsync() {
    yield delay(3000);
    yield put(increment());
}

export function* incrementCounterSaga() {
    yield fork(
        yield takeEvery(ASYNC_INCREMENT, incrementAsync),
    );
}

// Selectors
export const counterSelectors = {
    counter: state => ({ counter: state.counter }),
};


// Reducers
const COUNTER_INITIAL_STATE = 0;

export default function counter(state = COUNTER_INITIAL_STATE, { type, payload }) {
    switch (type) {
        case SET:
            return payload;

        case INCREMENT:
            return state + 1;

        case DECREMENT:
            return state - 1;

        default:
            return state;
    }
}
