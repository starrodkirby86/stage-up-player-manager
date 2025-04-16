const fs = require('fs');
const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');

const isDevelopment = process.env.NODE_ENV !== 'production';

/** @type {import('webpack').Configuration} */
const baseConfig = {
  mode: isDevelopment ? 'development' : 'production',
  context: __dirname,
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@internal': path.join(__dirname, 'src'),
      nodecg: path.join(__dirname, '../../..'),
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              ...require('./babel.config'),
            },
          },
        ],
      },
      {
        test: /\.(woff2?|ttf|eot|svg|otf|woff2|otf|ttf)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  plugins: [new ForkTsCheckerWebpackPlugin()],
};

/**
 * Creates a merged webpack config for specific bundles.
 *
 * @param {string} kind The type of bundle to generate
 * @param {string} name The name of the bundle file.
 */
function makeConfig(kind = 'dashboard', name = 'index') {
  /** @type {import('webpack').Configuration} */
  const mergedConfig = {
    name: `${name}.${kind}`,
    entry: path.join(__dirname, 'src', kind, `${name}.${kind}.tsx`),
    output: {
      path: path.join(__dirname, kind),
      filename: `${name}.${kind}.bundle.js`,
      uniqueName: `${name}.${kind}`,
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${name}.${kind}.bundle.css`,
      }),
      new HtmlWebpackPlugin({
        filename: `${name}.html`,
        title: `${name}.${kind}`,
        template: path.join(__dirname, 'src', kind, `${name}.${kind}.html`),
      }),
    ],
  };

  return merge(baseConfig, mergedConfig);
}

const dashboardConfig = fs
  .readdirSync(path.join(__dirname, 'src', 'dashboard'))
  .map(files => files.match(/(.+)\.dashboard\.tsx?$/i))
  .filter(Boolean)
  .map(match => match[1])
  .map(name => makeConfig('dashboard', name));

const graphicsConfig = fs
  .readdirSync(path.join(__dirname, 'src', 'graphics'))
  .map(files => files.match(/(.+)\.graphics\.tsx?$/i))
  .filter(Boolean)
  .map(match => match[1])
  .map(name => makeConfig('graphics', name));

/** @type {import('webpack').Configuration} */
const extensionConfig = merge(baseConfig, {
  name: 'extension',
  entry: path.join(__dirname, 'src', 'extension', 'index.extension.ts'),
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?/,
        loader: 'ts-loader',
        exclude: /node-modules/,
      },
    ],
  },
  externalsPresets: {
    node: true,
  },
  devtool: false,
  output: {
    path: __dirname,
    filename: 'extension.js',
    library: {
      type: 'commonjs2',
    },
  },
});

module.exports = [extensionConfig, ...dashboardConfig, ...graphicsConfig];
