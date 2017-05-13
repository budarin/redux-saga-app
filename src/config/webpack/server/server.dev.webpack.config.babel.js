import path from 'path';
import debug from 'debug';
import webpack from 'webpack';
import HappyPack from 'happypack';
import nodeExternals from 'webpack-node-externals';
import env from '../../env';
import serverBabelLoaderConfig from './server.babel.loader.config';

const log = debug('webpack:server');
const staticPath = `${env.STATICS_PROTOCOL}://${env.STATICS_HOST}:${env.STATICS_PORT}/`;

// в новой версии можно использовать переменные вызова и асинхронную обработку конфига
const serverConfig = ({
    watch: true,
    cache: true,
    target: 'node',
    entry: [
        'webpack/hot/poll?1000',
        './src/server/index.js',
    ],
    output: {
        publicPath: '/',
        path: path.resolve('.build/server'),
        libraryTarget: 'commonjs2',
        filename: 'server.js',
    },
    devtool: 'cheap-module-eval-source-map',
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
                        publicPath: staticPath,
                        name: 'img/[name].[ext]',
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
                            modules: true,
                            importLoaders: 1,
                            localIdentName: '[name].[local]_[hash:base64:7]',
                            minimize: false,
                        },
                    },
                    'postcss-loader',
                ],
            },
        ],
    },
    externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
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
            cacheContext: {
                env: process.env.NODE_ENV,
            },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
                TARGET: JSON.stringify('SERVER'),
            },
        }),
        new webpack.ProvidePlugin({
            Promise: 'zousan',
        }),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            'node_modules',
            path.resolve('./src'),
        ],
    },
});

log('Running server\'s webpack in DEVELOPMENT mode ...');

export default serverConfig;
