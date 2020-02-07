const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const { UnusedFilesWebpackPlugin } = require('unused-files-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src'),

  entry: ['babel-polyfill', 'react-hot-loader/patch', './hummingbird.js'],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'hummingbird-bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.css'],
    modules: [
      path.join(__dirname, 'src'),
      path.join(__dirname, 'node_modules'),
    ],
    alias: {
      localforage: 'localforage/dist/localforage.js',
      config: path.join(__dirname, './src/config', process.env.NODE_ENV || 'development'),
    },
  },

  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        API: JSON.stringify(process.env.API),
      },
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
    }),
    new MomentLocalesPlugin({
      localesToKeep: ['en', 'ru', 'uk', 'pt'],
    }),
    new UnusedFilesWebpackPlugin({
      globOptions: {
        ignore: ['node_modules/**/*', '**/*.spec.js', '**/*.test.js'],
      },
    }),
  ],

  module: {
    noParse: /node_modules\/localforage\/dist\/localforage.js/,
    rules: [
      {
        test   :/\.jsx?$/,
        exclude:/(node_modules|bower_components)/,
        use: [{
          loader: 'babel',
        }],
        query  :{
          presets:['react','es2015']
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
        }],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'global',
                localIdentName: '[name]__[local]--[hash:base64:5]',
              },
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
          },
        ],
      },
      {
        test: /\.(ico|png|jpg|jpeg|gif)$/,
        use: [{
          loader: 'file-loader',
        }],
        query: {
          name: 'images/[name]-[hash].[ext]',
        },
        include: [
          path.join(__dirname, 'src/assets/images'),
          path.join(__dirname, 'node_modules/leaflet-draw/dist/images'),
        ],
      },
      {
        test: /\.svg$/,
        issuer: {
          test: /\.js$/m,
        },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.svg/,
        use: [{
          loader: 'svg-url-loader',
        }],
      },
      {
        test: /(\.woff|\.woff2|\.otf|\.ttf|\.eot)$/,
        use: [{
          loader: 'file-loader',
        }],
        query: {
          name: 'fonts/[name]-[hash].[ext]',
        },
        include: path.join(__dirname, 'src/assets/fonts'),
      },
      {
        test: /\.po$/,
        use: [{
          loader: 'json-loader!po-loader?fuzzy=true',
        }],
      },
    ],
  },

  devtool: 'source-map',

  devServer: {
    inline: true,
    hot: true,
    contentBase: path.join(__dirname, '/src'),
    historyApiFallback: {
      disableDotRule: true,
    },
    noInfo: true,
    headers: { 'X-Custom-Header': 'yes' },
    stats: { colors: true },
    proxy: {
      '/tileServer': {
        target: 'http://localhost:3030',
        pathRewrite: {
          '^/tileServer/ndvi/.+/(.*)/(.*)/(.*)': '/ndvi/$1/$2/$3',
          '/tileServer/transparent.png': '/transparent.png',
        },
        secure: false,
      },
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': '',
        },
        secure: false,
      },
    },
  },
};
