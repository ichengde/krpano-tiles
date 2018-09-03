const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const prod = process.env.NODE_ENV === 'production';

const config = {
    entry: {
        try: './try/main.js',
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: [
                path.resolve(__dirname, './try'),
            ],
            loader: 'babel-loader',
            query: {
                presets: ['es2015'],
            },
        }, ],
    },
    plugins: [],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    devServer: {
        contentBase: [path.join(__dirname, 'test'), path.join(__dirname, 'build'), path.join(__dirname, 'try')],
        compress: true,
        index: 'index.html',
        port: 9000,
    },
};

if (prod) {
    config.plugins.push(new UglifyJSPlugin());
    config.output.filename = '[name].min.js';
}

module.exports = config;