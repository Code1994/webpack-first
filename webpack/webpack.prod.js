const merge = require('webpack-merge')
const common = require('./webpack.common')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = merge(common, {
  devtool: 'source-map',
  plugins: [
    // dev打包时无需清理dist，所以在prod.js中设置
    new CleanWebpackPlugin(),
    // dev环境下也有html-webpack-plugin 貌似会自动寻找静态资源 所以本来打算不使用copy-webpack-plugin 但发现在dev设置publicPath之后..

    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new webpack.DefinePlugin({
      ENV: JSON.stringify('prod')
    })
  ]
})
