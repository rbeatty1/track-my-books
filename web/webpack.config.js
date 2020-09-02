/*
    NOTE: This configuration set-up is for webpack < v4.
    @TODO:
        Update this for webpack v4
*/


var path = require('path'),
    HTMLPlugin = require("html-webpack-plugin")

module.exports = {
    mode: "development",
    entry: `./src/index.js`, // main JS file for application
    output: {
        path: `${__dirname}/dist`, // defining output path for build files
        filename: '[name].bundle.js' // defining naming convention for bundled dist file
    },
    module: {
        rules : [
            // want to bundle your CSS files? i got u fam
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            }
        ]
    },
    watch: true,
    devServer: {
        // configuration of server that will run upon npm start command
        contentBase: path.resolve(__dirname, 'src'),
        port: 9000
    },
    plugins: [
        new HTMLPlugin({
            title: 'Custom Template',
            template: './src/index.html',
            hash: true
        }),
    ]
};