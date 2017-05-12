import { Readable } from 'stream';
import co from 'co';
import fs from 'fs';
import path from 'path';
import debug from 'debug';
import React from 'react';
import Helmet from 'react-helmet';
import serialize from 'serialize-javascript';
import { renderToString } from 'react-dom/server';

import env from '../config/env';
import configureStore from '../common/store/index';
import disableDevTools from './utils/disableDevTools';
import initialCSS from '../common/assets/css/initial.css';
import getCurrentRouterInfo from './utils/getCurrentRouterInfo';
import getBundlesToPreload from './utils/getBundlesToPreload';
import getBundlesToLoad from './utils/getBundlesToLoad';
import externalDomains from './externalDomains';

import App from '../common/containers/App/App.jsx';

const log = debug('app:server:request');
const errorLog = debug('app:server:request:error');
const appRenderer = async store => renderToString(<App store={store} />);
const ressFileName = path.resolve('./node_modules/ress/dist/ress.min.css');
const ressCss = fs.readFileSync(ressFileName, 'utf8').toString();
const disableDevtoolsScript = (process.env.NODE_ENV === 'production') ? `(${disableDevTools.toString()})()` : '';
const staticUrlPrefix = `${env.STATICS_PROTOCOL}://${env.STATICS_HOST}:${env.STATICS_PORT}`;
const externalDomainsLinks = externalDomains();

let bundlesManifestPath = '';
let bundlesJson;

if (process.env.NODE_ENV === 'production') {
    bundlesManifestPath = './assets-manifest.json';
} else {
    bundlesManifestPath = './.build/client/assets-manifest.json';
}

// читаем хэшированное имя сгенерированных бандлов assets-manifest.json
const bundlesJsonString = fs.readFileSync(path.resolve(bundlesManifestPath), 'utf8').toString();

// преобразуем текст в JSON
try {
    bundlesJson = JSON.parse(bundlesJsonString);
} catch (e) {
    bundlesJson = {};
}

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

        // первый рендер приложение - для запуска саг для получения данных
        await appRenderer(store);

        log('1st render');

        const head = Helmet.rewind();

        head.defaultTitle = 'Комета';

        // получаем состояние стора
        let storeState = store.getState();

        // после рендера всего приложения у нас есть все стили задействованных компонент
        const criticalCSS = Object.values(storeState.serverCriticalCSS).join('');

        // получаем ссылки с "динамически загруженными" preload бандлами
        // получаем скрипты с "динамически загруженными" бандлами
        const bundleNames = Object.keys(storeState.serverDynamicBundles);
        const params = {
            bundlesJson,
            staticUrlPrefix,
            bundleNames,
        };
        const preloadDynamicBundles = getBundlesToPreload(params);
        const dynamicBundles = getBundlesToLoad(params);

        // push the <head> immediately
        // <editor-fold desc="ctx.body = head">
        this.push(`<!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="utf-8" content="text/html; charset=utf-8">
                ${head.title}
                ${head.meta}
                <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
                <meta name="application-name" content="Комета">
                <meta name="application-name" content="&#x41A;&#x43E;&#x43C;&#x435;&#x442;&#x430;">
                <meta name="apple-mobile-web-app-title" content="&#x41A;&#x43E;&#x43C;&#x435;&#x442;&#x430;">
                <meta name="theme-color" content="#fff">
                <meta name="msapplication-TileColor" content="#fff">
                <meta name="viewport" content="width=device-width,initial-scale=1,minimal-ui">
                <meta name="full-screen" content="yes">
                <meta name="robots" content="all"/>
                <meta name="robots" content="index, follow"/>
                <meta name="mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-capable" content="yes">
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
                <meta name="msapplication-config" content="browserconfig.xml">
                <meta name="msapplication-TileImage" content="/icons/mstile-144x144.png">
                <link rel="shortcut icon" href="favicon.ico">
                <link rel="icon" typ
                e="image/png" sizes="32x32" href="/icons/favicon-32x32.png">
                <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-chrome-192x192.png">
                <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png">
                <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-touch-icon-57x57.png">
                <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-touch-icon-60x60.png">
                <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-touch-icon-72x72.png">
                <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-touch-icon-76x76.png">
                <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-touch-icon-114x114.png">
                <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-touch-icon-120x120.png">
                <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-touch-icon-144x144.png">
                <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png">
                <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon-180x180.png">
    
                ${externalDomainsLinks}
    
                <link rel="preload" href="https://cdn.polyfill.io/v2/polyfill.min.js" as="script">
                ${preloadDynamicBundles}
                <link rel="preload" href="${staticUrlPrefix}/client.js" as="script">
                
                <script type="text/javascript" src="https://cdn.polyfill.io/v2/polyfill.min.js" defer></script>
                <script type="text/javascript" id="checkES6Features">
                    function checkES6Features() {
                        'use strict';
                    
                        if (typeof Symbol === 'undefined') {
                            return false;
                        }
                    
                        try {
                            eval('const fn = async function Func() { await fetch("/") }');
                            eval('function* Foo(){}');
                            eval('const bar = (x) => x+1');
                            eval('class Foo {}');
                        } catch (e) { return false; }
                    
                        return true;
                    }
                    
                    if (!checkES6Features()) {
                        window.location = '/UnsupportedBrowser';
                    }
                </script>
                <script type="text/javascript">${disableDevtoolsScript}</script>

                <link rel="apple-touch-startup-image"
                      media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 1)"
                      href="/icons/apple-touch-startup-image-320x460.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 320px) and (device-height: 480px) and (-webkit-device-pixel-ratio: 2)"
                      href="/icons/apple-touch-startup-image-640x920.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
                      href="/icons/apple-touch-startup-image-640x1096.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
                      href="/icons/apple-touch-startup-image-750x1294.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 414px) and (device-height: 736px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 3)"
                      href="/icons/apple-touch-startup-image-1182x2208.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 414px) and (device-height: 736px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 3)"
                      href="/icons/apple-touch-startup-image-1242x2148.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 1)"
                      href="/icons/apple-touch-startup-image-748x1024.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 1)"
                      href="/icons/apple-touch-startup-image-768x1004.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 768px) and (device-height: 1024px) and (orientation: landscape) and (-webkit-device-pixel-ratio: 2)"
                      href="/icons/apple-touch-startup-image-1496x2048.png">
                <link rel="apple-touch-startup-image"
                      media="(device-width: 768px) and (device-height: 1024px) and (orientation: portrait) and (-webkit-device-pixel-ratio: 2)"
                      href="/icons/apple-touch-startup-image-1536x2008.png">
                <link rel="manifest" href="manifest.json">
                <link rel="yandex-tableau-widget" href="yandex-browser-manifest.json">
                ${head.link}
                <style type="text/css" id="ressCss">${ressCss}</style>
                <style type="text/css" id="initialCss">${initialCSS.source}</style>
                <style type="text/css" id="criticalCss">${criticalCSS}</style>
                
                <script type="text/javascript" src="${staticUrlPrefix}/client.js" defer></script>
                ${dynamicBundles}                
            </head>`);
        // </editor-fold>

        log('send header');

        Promise.all(store.getRunningSagas()).then(async () => {
            log('start rendering with full store');

            // повторный рендер для получения полного интерфейса
            const appStr = await appRenderer(store);

            log('2nd render');

            // получаем состояние стора
            storeState = store.getState();

            log('2nd render storeState');

            storeState.serverCriticalCSS = undefined;
            storeState.serverDynamicBundles = undefined;

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
