const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    entry: './src/index.jsx',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader'],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['*', '.js', '.jsx'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    devServer: {
        contentBase: './public',
    },
    plugins: [
        new MomentLocalesPlugin(),
    ],
};
