import { take, call, put, fork, all } from 'redux-saga/effects';
import request from '../../../../services/request/base';
import createAction from '../../../../utils/createAction';

// consts
const REQUEST_FETCH = '@fetch/FETCH'; // TODO: удалить фейковый редьюсер
const REQUEST_RESULT = '@fetch/RESULT'; // TODO: удалить фейковый редьюсер

export const homeConstants = {
    REQUEST_FETCH,
    REQUEST_RESULT,
};

// Actions
export const homeActions = {
    fetchData: createAction(REQUEST_FETCH),
};


// Sagas
function* fetchSaga(payload) {
    const result = yield call(request, payload);

    yield put({
        type: REQUEST_RESULT,
        payload: { httpRequest: result.status },
    });
}

const url = 'https://cdn.polyfill.io/v2/polyfill.min.js';

function* fetchData() {
    // while (true) {
        yield take(REQUEST_FETCH);
        yield fork(fetchSaga, { url });
    // }
}

export function* homeSagas() {
    yield all([
        fork(fetchData),
    ]);
}


// selectors
export const homeSelector = state => ({ httpRequest: state.httpRequest });


// reducers
const HTTP_STATUS_INITIAL_STATE = 0;
const httpRequest = (state = HTTP_STATUS_INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case REQUEST_RESULT:
            return payload.httpRequest;

        default:
            return state;
    }
};

export default httpRequest;
