import { fork, all } from 'redux-saga/effects';
import watchNavigate from './navigate';

export default function* rootSagas() {
    yield all([
        fork(watchNavigate),
    ]);
}
