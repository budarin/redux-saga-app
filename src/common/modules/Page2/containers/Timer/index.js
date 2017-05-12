import { delay } from 'redux-saga';
import { take, put, select, fork } from 'redux-saga/effects';
import createAction from '../../../../utils/createAction';

import { timerStatuses } from '../../components/Timer/Timer.jsx';

const ONE_SECOND = 1000;

const START = '@timer/START';
const STOP = '@timer/STOP';
const RESET = '@timer/RESET';
const TICK = '@timer/TICK';

export const timerActionTypes = {
    START,
    TICK,
    RESET,
    STOP,
};


// Action creators
const start = createAction(START);
const stop = createAction(STOP);
const reset = createAction(RESET);
const tick = createAction(TICK);

export const timerActions = {
    start,
    stop,
    tick,
    reset,
};


// Sagas
const getTimerStatus = state => state.timer.status;

function* runTimer(getState) {
    // The sagasMiddleware will start running this generator.

    // Wake up when user starts timer.
    while (yield take(START)) {
        while (true) {
            // This side effect is not run yet, so it can be treated
            // as data, making it easier to test if needed.
            yield delay(ONE_SECOND);

            // Check if the timer is still running.
            // If so, then dispatch a TICK.
            try {
                const status = yield select(getTimerStatus);

                if (status === timerStatuses.RUNNING) {
                    yield put(tick());
                    // Otherwise, go idle until user starts the timer again.
                } else {
                    break;
                }
            } catch (err) {
                //
            }
        }
    }
}

export function* timerSaga() {
    yield fork(runTimer);
}

// Selectors
export const timeSelectors = {
    timer: state => ({ timer: state.timer }),
};


// Reducers
const TIMER_INITIAL_STATE = {
    status: timerStatuses.STOPPED,
    seconds: 0,
};

export default (state = TIMER_INITIAL_STATE, action = null) => {
    switch (action.type) {
        case START:
            return { ...state, status: timerStatuses.RUNNING };
        case STOP:
            return { ...state, status: timerStatuses.STOPPED };
        case TICK:
            return { ...state, seconds: state.seconds + 1 };
        case RESET:
            return { ...state, seconds: 0 };
        default:
            return state;
    }
};
