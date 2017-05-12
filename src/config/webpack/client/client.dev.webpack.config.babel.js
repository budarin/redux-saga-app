import fs from 'fs';
import path from 'path';
import debug from 'debug';
import webpack from 'webpack';
import HappyPack from 'happypack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';

import env from '../../env';
import clientBabelLoaderConfig from './client.babel.loader.config';

const log = debug('webpack:client');

const ressCss = fs.readFileSync(path.resolve('node_modules/ress/dist/ress.min.css'), 'utf8')
    .toString().replace(/\n/g, '');

// в новой версии можно использовать переменные вызова и асинхронную обработку конфига
const clientConfig = ({
    target: 'web',
    cache: true,
    entry: {
        client: [
            `webpack-dev-server/client?http://${env.STATICS_HOST}:${env.STATICS_PORT}`,
            'webpack/hot/only-dev-server',
            'react-hot-loader/patch',
            './src/client/index.js',
        ],
    },
    output: {
        path: path.resolve('./.build/client'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: `http://${env.STATICS_HOST}:${env.STATICS_PORT}/`,
    },
    devtool: 'inline-source-map',
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
                        name: 'img/[name].[ext]',
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader/useable',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            // importLoaders: 1,
                            localIdentName: '[name].[local]_[hash:base64:7]',
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new ManifestPlugin({
            fileName: 'assets-manifest.json',
            writeToFileEmit: true,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new ProgressBarPlugin(),
        new webpack.PrefetchPlugin('react'),
        new webpack.PrefetchPlugin('react-dom'),
        new HappyPack({
            loaders: [{
                path: 'babel-loader',
                query: clientBabelLoaderConfig,
            }],
            tempDir: '.temp/client/happypack',
            threads: 4,
            verbose: false,
            enabled: true,
            cache: true,
            cacheContext: { env: process.env.NODE_ENV },
        }),
        new HtmlWebpackPlugin({
            title: 'Комета',
            template: './src/common/assets/index.ejs',
            cache: true,
            ressCss,
            minify: false,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                TARGET: JSON.stringify('CLIENT'),
            },
        }),
        new webpack.ProvidePlugin({
            Promise: 'zousan',
        }),
        // заменяем асинхронные вызовы синронными
        new webpack.NormalModuleReplacementPlugin(/Async.jsx$/, resource => {
            resource.request = resource.request.replace(/Async.jsx$/, '.jsx');
            console.log('resource.request', resource.request);
        }),
        new ScriptExtHtmlWebpackPlugin({ defaultAttribute: 'defer' }),
        // remove serviceWorker from development version
/*      new ServiceWorkerWebpackPlugin({
            entry: path.resolve('./src/sw.js')
        }),*/
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve('./src'),
        ],
    },
    devServer: {
        host: env.STATICS_HOST,
        port: env.STATICS_PORT,
        historyApiFallback: true,
        hot: true,
        overlay: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
    },
});

log('Running client\'s webpack in DEVELOPMENT mode ...');

export default clientConfig;
