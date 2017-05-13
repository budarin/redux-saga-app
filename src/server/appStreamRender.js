import { Readable } from 'stream';
import co from 'co';
import debug from 'debug';
import React from 'react';
import serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server';

import env from '../config/env';
import configureStore from '../common/store/index';
import getCurrentRouterInfo from './utils/getCurrentRouterInfo';
import rootSagas from '../common/sagas/index';

import App from '../common/containers/App/App.jsx';

const log = debug('app:server:request');
const errorLog = debug('app:server:request:error');
const appRenderer = async store => renderToString(<App store={store} />);
const staticUrlPrefix = `${env.STATICS_PROTOCOL}://${env.STATICS_HOST}:${env.STATICS_PORT}`;

const getBodyHtml = async ({ appStr = '', storeState = '' }) => `<body>
    <noscript>
        <div>
            Извините, для корректной работы страницы необходимо включить javascript.
        </div>
    </noscript>

    <div id="app">${appStr}</div>

    <script id="initialState">window.STATE=${serialize(storeState, { isJSON: true })}</script>        
</body></html>`;

class View extends Readable {

    constructor(context) {
        super();

        this.ctx = context;

        // render the view on a different loop
        co.call(this, this.render).catch(context.onerror);
    }

    _read() {}

    async render() { // eslint-disable-line
        log('\n\nSTART REQUEST ---------------------------------------------');

        // инициализируем стор
        const store = configureStore({
            currentRouter: getCurrentRouterInfo(this.ctx),
        });

        log('store created');

        let sagas;
        let storeState;

        sagas = store.runSaga(rootSagas);

        // первый рендер приложение - для запуска саг для получения данных
        await appRenderer(store);

        log('1st render');

        // получаем состояние стора
        storeState = store.getState();

        // push the <head> immediately
        this.push(`<!DOCTYPE html>
        <html lang="ru">
        <head>
            <meta charset="utf-8" content="text/html; charset=utf-8">
            <script type="text/javascript" src="${staticUrlPrefix}/client.js" defer></script>
        </head>`);

        log('send header');


        Promise.all([sagas.done]).then(async () => {
            log('start rendering with full store');

            // повторный рендер для получения полного интерфейса
            const appStr = await appRenderer(store);

            log('2nd render');

            // получаем состояние стора
            storeState = store.getState();

            log('2nd render storeState');

            const bodyHtml = await getBodyHtml({ appStr, storeState });

            this.push(bodyHtml);

            // end the stream
            this.push(null);
        })
            .catch(error => {
                errorLog('Ошибка: ', error.stack);
                this.ctx.throw('Server error', 500);
            })
            .finally(() => {
                // end the stream
                this.push(null);

                // clean ctx
                this.ctx = undefined;

                log('END REQUEST ---------------------------------------------');
                store.close();
            });

        log('end of render method');
    }
}

export default View;
