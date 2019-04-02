const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        customerView: './src/main/resources/assets/src/customerView.js',
        managerView: './src/main/resources/assets/src/managerView.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/assets/dist')
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.js?$/,
                loader: 'eslint-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-env", "@babel/preset-react"] }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    'file-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['src/main/resources/assets/dist']),
        new HtmlWebpackPlugin({
            title: 'Commerce Bank',
            template: './src/main/resources/assets/src/index.html',
            favicon: './src/main/resources/assets/src/images/favicon.ico',
            chunks: ['customerView'],
            filename: 'index.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Commerce Bank',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['managerView'],
            filename: 'managerView.html' //relative to root of the application
        })
    ],
};