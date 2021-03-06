const common = require('./webpack.common')
const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

// 测量各个loader与插件所耗费的时间
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const smwp = new SpeedMeasureWebpackPlugin()

module.exports = smwp.wrap(merge(common, {
  devServer: {
    // ！！！开发环境需要指定目录，devServer会在该目录下寻找不属于webpack打包的静态资源。另外如果使用了html-webpack-plugin,则不用再配置。另外copy-webpack-plugin的使用待研究  contentBase会影响寻找不由webpack打包的静态资源，无论是否使用html-webpack-plugin
    // contentBase: path.resolve(__dirname, '../public'),
    // dev服务的挂载目录  优先级低于output中的publicPath 而且如果output也设置了publicPath 该处会自动使用
    publicPath: '/',
    quiet: false, //默认不启用 启用之后，终端不再输出错误信息
    inline: true, //默认开启 inline 模式，如果设置为false,开启 iframe 模式
    stats: "errors-only", //终端仅打印 error
    overlay: false, //默认不启用 报错时是否将错误全屏展示在浏览器中
    clientLogLevel: "silent", //日志等级
    compress: true, //是否启用 gzip 压缩

    // 自定义响应头
    headers: {
      "x-customer-header": "yxp"
    },
    // 在前端history路由时，如果404，定向到index.html
    historyApiFallback: true,
    // 网络地址 默认为localhost 如果需要外部访问，可设置为'0.0.0.0'  但是'0.0.0.0:3000'无法访问。。。
    host: '0.0.0.0',
    // 端口号 默认是8080
    port: '3000',
    // 模块热加载
    hot: true,
    // 开发环境代理
    proxy: {
      '/api': {
        target: 'http://localhost:4000/',
        // 重写路径
        pathRewrite: {
          "^/api": "/"
        },
        // 如果target是域名需要额外添加一个参数changeOrigin: true，否则会代理失败
        changeOrigin: true
      }
    },
    // 将运行进度输出到终端 官网说只用于命令行工具 --progress 但是试了下 在这里配置也是成功的
    progress: true,
    // 使用本机ip  需要将host配置成0.0.0.0 另外也可以使用portfinder这个npm库，该库中有本机ip地址, 也可用于寻找当前端口被占用时寻找新端口
    useLocalIp: true
  },
  // sourceMap
  /*
  开发
  cheap-eval-source-map  打包后的代码 (行数)
  cheap-module-eval-source-map  源代码 (行数)  --- 综合速度及开发目的来说 最优

  生产
  source-map 源代码
  hidden-source-map 部分源代码
  nosources-source-map 
  */ 
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // 定义dev环境下的全局环境变量
    // DefinePlugin 字符串=>变量 JSON.stringfy('')=>字符串 对象=>对象 布尔值=>布尔值 
    new webpack.DefinePlugin({
      ENV: JSON.stringify('dev')
    })
  ],
}))
