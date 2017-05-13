import path from 'path';
import debug from 'debug';
import webpack from 'webpack';
import HappyPack from 'happypack';
import BabiliPlugin from 'babili-webpack-plugin';
import nodeExternals from 'webpack-node-externals';

import serverBabelLoaderConfig from './server.babel.loader.config';

const log = debug('webpack:server');

// в новой версии можно использовать переменные вызова и асинхронную обработку конфига
const serverConfig = ({
    watch: false,
    cache: true,
    target: 'node',
    entry: './src/server/index.js',
    output: {
        publicPath: '/',
        path: path.resolve('./.build/server'),
        libraryTarget: 'commonjs2',
        filename: 'server.js',
    },
    // devtool: 'hidden-source-map',
    module: {
        noParse: [/\.min\.js/],
        rules: [
            {
                test: /\.(js|jsx)$/,
                include: path.resolve('./src'),
                exclude: path.resolve('node_modules'),
                use: 'happypack/loader',
            },
            {
                test: /\.(svg|png|jpg|gif)$/,
                include: path.resolve('./src'),
                exclude: path.resolve('node_modules'),
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'img/[name].[hash:8].[ext]',
                        hash: 'sha512',
                        digest: 'hex',
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'fake-style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // This breaks HMR (CSS Modules change name because their hash changes)
                            modules: true,
                            // importLoaders: 1,
                            localIdentName: '[local]_[hash:base64:7]',
                            // This breaks background-image and other relative paths
                            // Monitor this: https://github.com/webpack/style-loader/pull/124
                            // sourceMap: DEV,
                            sourceMap: false,
                            import: false,
                            url: false,
                            // CSSNano Options
                            minimize: {
                                safe: true,
                                colormin: false,
                                calc: false,
                                zindex: false,
                                discardComments: { removeAll: true },
                            },
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new HappyPack({
            loaders: [{
                path: 'babel-loader',
                query: serverBabelLoaderConfig,
            }],
            tempDir: '.temp/server/happypack',
            threads: 4,
            verbose: false,
            enabled: true,
            cache: true,
            cacheContext: { env: process.env.NODE_ENV },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                TARGET: JSON.stringify('SERVER'),
            },
        }),
        new webpack.ProvidePlugin({
            Promise: 'zousan',
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
        }),
        // injectin source-map into script
/*        new webpack.BannerPlugin({
            banner: 'require("source-map-support").install();',
            raw: true,
            entryOnly: false,
        }),*/
        new BabiliPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve('./src'),
        ],
        alias: {
            'react': 'react/dist/react.min.js',
            'react-dom/server': 'react-dom/dist/react-dom-server.min.js',
        },
    },
});

log('Running server\'s webpack in PRODUCTION mode ...');

export default serverConfig;
