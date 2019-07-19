const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const glob = require('glob');
// CSS压缩丑化
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
// JavaScript压缩丑化
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        // index: './src/index.js',
        another: './src/js/another-module.js',
        index: './src/js/index.js',
        main: './src/js/main.js',
        polyfills: './src/js/polyfills.js',
    },
    plugins: [
        new UglifyJSPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    drop_debugger: process.env.NODE_ENV === 'production' ? true : false,
                    drop_console: process.env.NODE_ENV === 'production' ? true : false,
                }
            },
            sourceMap: true,
            parallel: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true,
                map: {
                    inline: false
                }
            }
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Production'
        }),
        // 保持未改动的文件hash一致
        // new webpack.HashedModuleIdsPlugin(),
        new LodashModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            join: ['lodash', 'join']
        }),
        // css文件提取
        new ExtractTextPlugin('./css/styles.[contenthash:7].css'),
        new HtmlWebpackPlugin({
            // 设置输出文件位置
            filename: './html/index.html',
            // 本地模板文件位置
            template: 'index.html',
            inject: true,
            chunks: ['index', 'another', 'polyfills'],
            minify: {
                // 剥离HTML注释
                removeComments: true,
                // 尽可能删除属性的引号
                removeAttributeQuotes: false,
                // 折叠对文档树中的文本节点有贡献的空白空间
                collapseWhitespace: false,
            },
        }),
        new HtmlWebpackPlugin({
            // 设置输出文件位置
            filename: './html/main.html',
            // 本地模板文件位置
            template: './src/html/main.html',
            inject: true,
            chunks: ['main', 'another', 'polyfills'],
            minify: {
                // 剥离HTML注释
                removeComments: true,
                // 尽可能删除属性的引号
                removeAttributeQuotes: false,
                // 折叠对文档树中的文本节点有贡献的空白空间
                collapseWhitespace: false,
            },
        })
    ],
    output: {
        filename: './js/[name].js?hash=[chunkhash:7]',
        chunkFilename: './js/[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    }
};


/*//多入口js的配置，读取src/page下所有的js文件
function entries() {
    let jsDir = path.resolve(__dirname, './src/html');
    let entryFiles = glob.sync(jsDir + '/!**!/!*.js');
    let map = {};

    for (let i = 0; i < entryFiles.length; i++) {
        let filePath = entryFiles[i];
        let filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        map[filename] = filePath;
    }
    return map;
}

//读取多个html模板，进行插件实例化
function newHtmlWebpackPlugins(){
    let jsDir = path.resolve(__dirname, './src/html');
    let htmls = glob.sync(jsDir + '/!**!/!*.html');
    let plugins=[];
    // 首页
    plugins.push(new HtmlWebpackPlugin({
        filename: filename,
        template: filePath,
        chunks: [filename_no_extension],
    }));
    // 循环获取目录下的html文件
    for (let i = 0; i < htmls.length; i++) {
        let filePath = htmls[i];
        let filename_no_extension = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.'));
        let filename = filename_no_extension.concat('.html');
        plugins.push(new HtmlWebpackPlugin({
            filename: filename,
            template: filePath,
            chunks: [filename_no_extension],
        }))
    }

    return plugins;
}*/
