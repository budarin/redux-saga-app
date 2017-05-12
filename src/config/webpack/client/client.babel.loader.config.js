export default {
    babelrc: false,
    presets: [
        'react',
    ],
    plugins: [
        'transform-es2015-destructuring',
        'transform-object-rest-spread',
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
                'external-helpers',
                'transform-flow-strip-types',
                'transform-react-remove-prop-types',
                'transform-react-constant-elements',
                'transform-react-inline-elements',
            ],
        },
    },
};
