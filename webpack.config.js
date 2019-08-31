const path = require('path');
module.exports = {
    entry: [
      './src/index.tsx', './src/App.css'
    ],
    output: {
      path: __dirname,
      publicPath: '/',
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
            test: /\.tsx$/,
            exclude: /node_modules/,
            use: {
              loader: "ts-loader"
            }
        },
        {
            test: /\.ts$/,
            exclude: /node_modules/,
            use: {
              loader: "ts-loader"
            }
        },
        {
          test: /\.css$/,
          use: [
              "style-loader", "css-loader"
          ]
        }
      ]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
      },
  };