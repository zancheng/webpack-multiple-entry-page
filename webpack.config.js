const resolve = require('path').resolve;
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const url = require('url');
const publicPath = './';
const port = '8010'; // 默认一个打开浏览器的端口号 如：http://localhost:8010
/*
*
* 参考地址： https://www.cnblogs.com/legu/p/5741116.html
*
* */
const glob = require('glob');
function getEntry (globPath, base, replaceed) {
    var entries = {};
    glob.sync(globPath).forEach(function (entry) {
        //获取对应文件的名称
        let moduleName = entry.match(/(\w+).\w+$/)[1];
        if(base){
            let temp= path.relative(base,entry)
            moduleName=temp.replace(path.extname(entry),'')
            console.log(moduleName);
        }
        //moduleName 去掉第一次出现的replaceed字符串，并去掉所有‘\’
        if(replaceed){
            let idx=moduleName.indexOf(replaceed)
            if(idx>=0){
                let pre= moduleName.substring(0,idx)
                let after = moduleName.substring(idx+replaceed.length).replace(/^[\\\/]*/,'')
                moduleName=pre+after
            }
        }
        //对象key中，‘\’替换成‘/’,以便插入的代码路径是‘/’
        moduleName = moduleName.replace(/\\/g,"\/");
        entries[moduleName] = entry
    });
    return entries;
}
let entries = {};
// 我们的key不是简单用的上一个代码的index,login而是用的index/index,login/login因为考虑在login目录下面还有register
// 文件路径的\\和/跟操作系统也有关系，需要注意
let htmlFiles = getEntry('./src/html/*.html', 'src\\html\\');
let jsFiles = getEntry('./src/js/*.js', 'src\\js\\');
let HtmlPlugin = [];
for (let key in htmlFiles) {
  // <script src="../js/lanuage.js"></script>
    entries[key] = jsFiles[key];
    let chunks = [];
    // 如果有对应html的js再加入
    if (entries[key] !== undefined) {
        chunks = [key];
    } else {
        delete entries[key];
    }
    HtmlPlugin.push(
        new HtmlWebpackPlugin({
            // 设置输出文件位置
            filename: (key === '' ? 'index.html' : 'html/' + key + '.html'),
            // 本地模板文件位置
            template: htmlFiles[key],
            inject: true,
            chunks: chunks,
            minify: {
                // 剥离HTML注释
                removeComments: true,
                // 尽可能删除属性的引号
                removeAttributeQuotes: false,
                // 折叠对文档树中的文本节点有贡献的空白空间
                collapseWhitespace: false,
            },
        })
    );
}

module.exports = (options = {}) => ({
    entry: entries,
    output: {
        //插入的js后面跟上chunkhash（文件修改后，chunkhash会变换）
        path: resolve(__dirname, 'static'),
        filename: options.dev ? 'js/[name].js' : 'js/[name].js?v=[hash]',
        chunkFilename: '[id].js?[hash]',
        publicPath: options.dev ? '/' : './../', // 配置了html内js和css的路径
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: ['vue-loader'],
        },
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    interpolate: true,
                },
            },
            {
                test: /\.js$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter'), // 默认的错误提示方式
                    },
                },
                enforce: 'pre', // 编译前检查
                exclude: /node_modules/, // 不检测的文件
                include: [resolve(__dirname) + '/src'], // 要检查的目录
            },
            {
                test: /\.(css|scss|sass)$/,
                // 此处为使用postcss分离css的写法
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader", "postcss-loader"],
                    // css中的基础路径
                    publicPath: "../",
                })
            },
            {
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1000,  // 图片多大时压缩，过小的转成base64
                        // placeholder 占位符
                        name: 'assets/[name]_[hash].[ext]?', // 保持打包后的图片名字和原来一样
                    },
                }],
            },
        ],
    },
    plugins: [
        ...HtmlPlugin,
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
        }),
        // 提取css文件
        // css文件提取
        new ExtractTextPlugin('css/[name]_[hash].css'),
        new CleanWebpackPlugin(),
        // 保持未改动的文件hash一致
        new webpack.HashedModuleIdsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new OpenBrowserPlugin({ url: 'http://localhost:' + port + '/html/hotel.html' }), // 自动打开浏览器
    ],
    resolve: {
        alias: {
            '~': resolve(__dirname, 'src'),
        },
        extensions: ['.js', '.vue', '.json', '.css', '.sass'],
    },
    devServer: {
        host: '127.0.0.1',
        port: port,
        https: false,
        proxy: { // 设置dev运行时的代理
            '/api/': {
                target: 'http://127.0.0.1:8080', // 代理地址
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
            '/openweb': {
              target: 'http://dev2.unisiot.com:53184', // 代理地址
              changeOrigin: true
          },
        },
        historyApiFallback: {
            index: url.parse(options.dev ? '/assets/' : publicPath).pathname,
        },
    },
    devtool: options.dev ? '#eval-source-map' : false, // 是否需要source-map
});
