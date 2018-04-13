const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');

const libraryName = 'cerberusAuth';

const propTypesExternals = {
  root: 'PropTypes',
  commonjs2: 'prop-types',
  commonjs: 'prop-types',
  amd: 'prop-types',
};

const reduxExternals = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux',
};
const reactReduxExternals = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux',
};

const reactRouter = {
  root: 'ReactRouterDom',
  commonjs2: 'react-router-dom',
  commonjs: 'react-router-dom',
  amd: 'react-router-dom',
};


const reactExternals = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const reactDOMExternals = {
  root: 'ReactDOM',
  commonjs2: 'react-dom',
  commonjs: 'react-dom',
  amd: 'react-dom',
};

module.exports = {
  entry: {
    cerberus: [`${__dirname}/src/cerberus/index.js`],
  },
  output: {
    path: path.join(__dirname, './lib'),
    filename: '[name].js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  externals: {
    react: reactExternals,
    'react-dom': reactDOMExternals,
    'prop-types': propTypesExternals,
    'react-router-dom': reactRouter,
    redux: reduxExternals,
    'react-redux': reactReduxExternals,
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        compressor: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      },
    }),
  ],
};



/* const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './example/index.html',
  filename: 'index.html',
  inject: 'body',
});

module.exports = {
  entry: path.join(__dirname, 'example'),
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    HtmlWebpackPluginConfig,
  ],
  devServer: {
    port: 3000,
    host: 'localhost',
    // Be possible go back pressing the "back" button at chrome
    historyApiFallback: true,
    noInfo: false,
    stats: 'minimal',
    publicPath: './dist',
    contentBase: path.join(__dirname, './dist'),
    // hotmodulereplacementeplugin
    hot: true,
  },
};*/
