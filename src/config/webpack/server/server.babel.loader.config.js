module.exports = { // eslint-disable-line
    babelrc: false,
    presets: [
        'react',
        ['env', {
            targets: {
                node: 'current',
            },
            cacheDirectory: true,
        }],
    ],
    plugins: [
        'transform-es2015-destructuring',
        'transform-object-rest-spread',
        // node doesnt has import modules feature
        'add-module-exports',
        'transform-class-properties',
        'syntax-trailing-function-commas',
        ['lodash', { id: ['lodash', 'recompose'] }],
    ],
    env: {
        development: {
            plugins: [
                'babel-plugin-transform-react-jsx-self',
                'babel-plugin-transform-react-jsx-source',
                ['babel-plugin-runtyper', { enabled: true }],
            ],
        },
        production: {
            plugins: [
                'transform-flow-strip-types',
                'transform-react-remove-prop-types',
                'transform-react-constant-elements',
                'transform-react-inline-elements',
            ],
        },
    },
};
