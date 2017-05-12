let config; // eslint-disable-line

if (process.env.NODE_ENV === 'production') {
    config = require('./client/client.prod.webpack.config.babel.js').default; // eslint-disable-line
} else {
    config = require('./client/client.dev.webpack.config.babel.js').default; // eslint-disable-line
}

export default config;
