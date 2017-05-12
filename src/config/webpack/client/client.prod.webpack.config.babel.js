import fs from 'fs';
import path from 'path';
import debug from 'debug';
import webpack from 'webpack';
import HappyPack from 'happypack';
import BabiliPlugin from 'babili-webpack-plugin';
import WebpackChunkHash from 'webpack-chunk-hash';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import BundleAnalyzer from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';
import ChunkManifestPlugin from 'chunk-manifest-webpack-plugin';
import ServiceWorkerWebpackPlugin from 'serviceworker-webpack-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';

import clientBabelLoaderConfig from './client.babel.loader.config';

const log = debug('webpack:client');

const ressCss = fs.readFileSync(path.resolve('node_modules/ress/dist/ress.min.css'), 'utf8')
    .toString().replace(/\n/g, '');

// в новой версии можно использовать переменные вызова и асинхронную обработку конфига
const clientConfig = ({
    target: 'web',
    // devtool: 'source-map',
    cache: true,
    entry: {
        vendor1: [
            'react',
            'react-dom',
            'superagent',
        ],
        vendor2: [
            'zousan',
            'react-redux',
            'redux-saga',
            'normalizr',
            'react-helmet',
            'classnames',
            'path-to-regexp',
            './src/common/utils/babelHelpers.js',
            'debug',
        ],
        client: './src/client/index.js',
    },
    output: {
        path: path.resolve('./.build/client'),
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        publicPath: '/',
    },
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
                    'style-loader/useable',
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
                                // safe: true,
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
    plugins: [
        new ManifestPlugin({
            fileName: 'assets-manifest.json',
            writeToFileEmit: true,
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new ProgressBarPlugin(),
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
            minify: {
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new CopyWebpackPlugin([
            { from: './src/common/assets/browser-icons', to: 'icons' },
            { from: './src/common/assets/UnsupportedBrowser.html' },
            { from: './src/common/assets/favicon.ico' },
            { from: './src/common/assets/manifests' },
        ]),
        new webpack.optimize.CommonsChunkPlugin({
            name: ['vendor1', 'vendor2', 'manifest'], // vendor libs + extracted manifest
            minChunks: Infinity,
        }),
        new webpack.HashedModuleIdsPlugin(),
        new WebpackChunkHash(),
        new ChunkManifestPlugin({
            filename: 'chunk-manifest.json',
            manifestVariable: 'webpackManifest',
        }),
        new ScriptExtHtmlWebpackPlugin({
            inline: ['manifest'],
            defer: ['vendor1', 'vendor2', 'client'],
            preload: ['vendor1', 'vendor2', 'client'],
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
                TARGET: JSON.stringify('CLIENT'),
            },
        }),
        new ServiceWorkerWebpackPlugin({ entry: path.resolve('./src/sw/sw.js') }),
        new BundleAnalyzer.BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: 'stats_report.html',
        }),
        new webpack.ProvidePlugin({
            Promise: 'zousan',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            async: true,
            children: true,
            minChunks: 2,
        }),
        new BabiliPlugin(),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve('./src'),
        ],
    },
});

log('Running client\'s webpack in PRODUCTION mode ...');

export default clientConfig;
