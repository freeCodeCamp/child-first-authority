import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
  devtool : 'inline-source-map',
  entry   : [
    'eventsource-polyfill', // necessary for hot reloading with IE
    'webpack-hot-middleware/client?reload=true', //note that it reloads the page if hot module reloading fails.
    path.resolve(__dirname, 'client/index.js')
  ],
  target : 'web',
  output : {
    path       : path.resolve(__dirname, 'dist'),
    publicPath : '/',
    filename   : 'bundle.js'
  },
  devServer : {
    contentBase : path.resolve(__dirname, 'client')
  },
  plugins : [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template : 'client/index.ejs',
      minify   : {
        removeComments     : true,
        collapseWhitespace : true
      },
      inject : true
    })
  ],
  module : {
    loaders : [
      {
        test    : /\.js$/,
        include : path.join(__dirname, 'client'),
        loader  : 'babel-loader',
        query   : {
          presets : ['es2015', 'react', 'stage-2']
        }
      }, {
        test    : /(\.css)$/,
        loaders : ['style-loader', 'css-loader']
      }, {
        test   : /\.scss$/,
        loader : ['style-loader', 'css-loader', 'sass-loader']
      }, {
        test   : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader'
      }, {
        test   : /\.png$/,
        loader : 'url-loader?limit=100000'
      }, {
        test   : /\.jpg$/,
        loader : 'file-loader'
      }, {
        test   : /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test   : /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=application/octet-stream'
      }, {
        test   : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'file-loader'
      }, {
        test   : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader : 'url-loader?limit=10000&mimetype=image/svg+xml'
      }
    ]
  }
};