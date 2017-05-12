let config; // eslint-disable-line

if (process.env.NODE_ENV === 'production') {
    config = require('./server/server.prod.webpack.config.babel.js').default; // eslint-disable-line
} else {
    config = require('./server/server.dev.webpack.config.babel.js').default; // eslint-disable-line
}

export default config;
