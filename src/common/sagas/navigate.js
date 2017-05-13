import { take, put } from 'redux-saga/effects';
import { START_NAVIGATE_TO, NAVIGATE_TO } from '../actions/navigateTo';
import getLocationInfo from '../utils/getLocationInfo';

/*
* Наблюдает за экшеном NAVIGATE_TO, получает url, меняет строку браузера на новый url,
* преобразует простой url в полный объект для анализа и кладет в стор
*/
function* watchNavigate() {
    // while (true) {
    const { payload: { url } } = yield take(START_NAVIGATE_TO);

    yield history.pushState(null, '', url);

    yield put({
        type: NAVIGATE_TO,
        payload: getLocationInfo(url),
    });
    // }
}

export default watchNavigate;
