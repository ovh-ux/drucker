const path = require("path");
const webpack = require("webpack");

module.exports = {
    entry: "./lib/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "plugin.js",
        libraryTarget: "commonjs"
    },
    module: {
        loaders: [{
            test: /\.js$/,
            loader: "babel-loader"
        } ]
    },
    plugins: [
      new webpack.optimize.DedupePlugin()
    ]
};
