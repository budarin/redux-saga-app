import fs from 'fs';
import Koa from 'koa';
import path from 'path';
import React from 'react';
import debug from 'debug';
import serve from 'koa-static';

import appStreamRender from './appStreamRender';

const app = new Koa();
const log = debug('app:server');
const unsupportedBrowser = fs.readFileSync('./.build/server/UnsupportedBrowser.html', 'utf8').toString();

if (process.env.NODE_ENV === 'development') {
    app.use(async (ctx, next) => {
        const start = Date.now();

        await next();

        const ms = Date.now() - start;

        // ctx.set('X-Response-Time', `${ms}ms`);
        log('X-Response-Time: ', ctx.path, `${ms}ms`);
    });

    app.use(serve(path.resolve('./.build/server')));

    app.use(async (ctx, next) => {
        if (ctx.path === '/UnsupportedBrowser') {
            log('UnsupportedBrowser');
            ctx.body = unsupportedBrowser;

            return;
        }
        await next();
    });
}


app.use(async ctx => {
    ctx.type = 'html';
    ctx.body = new appStreamRender(ctx);
});

export default app;
