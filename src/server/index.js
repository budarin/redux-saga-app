import debug from 'debug';
import http from 'http';

import app from './server';
import env from '../config/env';

const port = env.PORT;
const log = debug('app:server');
const logError = debug('app:server:error');
const server = http.createServer(app.callback()).listen(port);

const shutdown = code => {
    log(`server is shutting down ...`);  // eslint-disable-line
    server.close();
    process.exit(code || 0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

process.on('uncaughtException', err => {
    logError('uncaughtException', err.stack); // eslint-disable-line
    shutdown(1);
});

log(`Server running on: http://localhost: ${port}`);
