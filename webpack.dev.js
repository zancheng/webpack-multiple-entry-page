const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const common = require('./webpack.common.js');
const resolve = require('path').resolve;

module.exports = merge(common, {
    devServer: {
        contentBase: './dist',
        overlay: {
            errors: true,
            warnings: true
        }
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader',
                options: {
                    interpolate: true,
                },
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [ // 提取的时候，继续用下面的方式处理
                        {
                            loader: 'css-loader'
                        }
                    ]
                })
            },
            {
                test: /\.scss/,
                use: [{
                    loader: 'style-loader',
                }, {
                    loader: 'css-loader',
                }, {
                    loader: 'sass-loader',
                }, {
                    loader: 'postcss-loader',
                }],
            },
            {
                test: /\.js$/,
                use: [
                {
                    loader:'babel-loader',
                    options:{
                        presets: ['babel-preset-env'],
                        plugins: ['lodash']
                    }
                }, {
                    loader: 'eslint-loader',
                    options: {
                        formatter: require('eslint-friendly-formatter'), // 默认的错误提示方式
                        emitWarning: true,
                    }
                }],
                enforce: 'pre', // 编译前检查
                exclude: [resolve(__dirname) + '/node_modules'] // 不检测的文件
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        // placeholder 占位符
                        name: 'assets/[name].[hash:7].[ext]', // 保持打包后的图片名字和原来一样
                    },
                }]
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            }
        ]
    }
});
