const resolve = require('path').resolve
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const url = require('url')
const publicPath = '/'
const port = '8010' // 默认一个打开浏览器的端口号 如：http://localhost:8010
/*
* 参考地址： https://www.cnblogs.com/legu/p/5741116.html
*
* */
const glob = require('glob')
function getEntry(globPath, pathDir) {
    var files = glob.sync(globPath);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        dirname = path.dirname(entry);
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
        console.log(2, pathname, entry);
        entries[pathname] = './' + entry;
    }
    return entries;
}
//我们的key不是简单用的上一个代码的index,login而是用的index/index,login/login因为考虑在login目录下面还有register
//文件路径的\\和/跟操作系统也有关系，需要注意
var htmls = getEntry('./src/**/*.html', 'src\\');
var entries = {};
var HtmlPlugin = [];
for (var key in htmls) {
    entries[key] = htmls[key].replace('.html', '.js')
    console.info(entries[key])
    entries['common'] = '~/js/common/common.js'
    entries['nav'] = '~/js/common/nav.js'
    HtmlPlugin.push(
        new ExtractTextPlugin('css/[name].css?[chunkhash]'),
        new HtmlWebpackPlugin({
            filename: (key == 'index' ? 'index.html' : key + '.html'),
            template: htmls[key],
            inject: true,
            chunks: [key, 'common', 'nav'],
            inlineSource: '.(js|css)$'
        })
    )
}
HtmlPlugin.push(
    new OpenBrowserPlugin({ url: 'http://localhost:'+port })
)
module.exports = (options = {}) => ({
  /*entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },*/
  entry: entries,
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]'
    /*publicPath: options.dev ? '/assets/' : publicPath*/
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test:/\.css$/,
        //注意：这里还需要更改一下
        use:ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      /*{
        test: /\.less$/,
        //下面两行，作用相同，选择自己比较喜欢的样式即可
        loader: 'style-loader!css-loader!less-loader'
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader'
        ]
      },*/
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css-loader!less-loader')
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: HtmlPlugin,
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json', '.css']
  },
  devServer: {
    host: '127.0.0.1',
    port: port,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:8080',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})