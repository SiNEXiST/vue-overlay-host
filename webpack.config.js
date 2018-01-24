const path = require("path");

module.exports = {
    entry: path.resolve(__dirname, "src/dev.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: "vue-html-loader"
            },
            {
                test: /\.js$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.node$/,
                use: "node-loader"
            },
            {
                test: /\.vue$/,
                use: {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            sass:
                                "vue-style-loader!style-loader!css-loader!sass-loader?indentedSyntax=1",
                            scss:
                                "vue-style-loader!style-loader!css-loader!sass-loader"
                        }
                    }
                }
            }
        ]
    },
    resolve: {
        alias: {
            vue$: "vue/dist/vue.js"
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    devtool: 'inline-source-map',
    devServer: {
        stats: 'minimal',
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    }
};
