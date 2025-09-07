const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map', // Helps with debugging by providing source maps.
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans dist folder before builds.
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // For .js and .jsx files.
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/i,
        type: "asset/resource", // emits a file, returns URL
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Allow imports without extension: .js, .jsx.
  },
  devServer: {
    static: './dist',
    hot: true,  // Enable hot module replacement.
    port: 3000,
    open: true, // Open the browser after server had been started.
  },
};
