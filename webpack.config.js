const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        custView: './src/main/resources/assets/src/custView.js',
    },
    mode: 'development',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'src/main/resources/assets/dist')
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/preset-react"] }
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
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
            chunks: ['custView'],
            filename: 'index.html' //relative to root of the application
        }),
        new HtmlWebpackPlugin({
            title: 'Commerce Bank',
            template: './src/main/resources/assets/src/index.html',
            chunks: ['custView'],
            filename: 'managerView.html' //relative to root of the application
        })
    ],
    optimization: {
        minimizer: [new UglifyJsPlugin({
            test: /\.(js|jsx)$/
        })],
    }
};