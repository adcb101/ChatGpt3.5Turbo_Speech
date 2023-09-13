const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

//import '../wwwroot/dist'
//[contenthash]
module.exports = {
  entry: './src/js/site.js', // 指定入口文件
  output: {
    filename: 'js/bundle.[contenthash].js', // 输出文件名，包含哈希值
    path: path.resolve(__dirname, '..', 'wwwroot', 'dist') // 输出文件路径
  },
  //devtool: 'eval-source-map',
  devtool:'nosources-cheap-source-map',
 
  mode: 'production',
 // mode: 'development',

  module: {
    rules: [
      {
        test: /\.css$/,//
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
      },
     
    
      {
        test: /\.(scss)$/,
        use: [{
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [
                  require('autoprefixer')
                ]
              }
            }
          },
          {
            loader: 'sass-loader'
          }
        ]
      },

      
      {
        test: /\.(png|eot|woff(2)?|ttf|otf|svg)$/i,
        type: 'asset'
      },
      // { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' } ,
      {
        mimetype: 'image/svg+xml',
        scheme: 'data',
        type: 'asset/resource',
        generator: {
          filename: 'icons/[hash].svg'
        }
      },
    ]
  },
 
  plugins: [
    
           new CleanWebpackPlugin(),
           
      
           new MiniCssExtractPlugin({
                 filename: "css/[name].[contenthash].css",
             }),
             new CompressionPlugin({
              algorithm: 'gzip',
              threshold: 4096
            }),
            //new BundleAnalyzerPlugin()
            
          
       ],
  // plugins: [
  //   new CleanWebpackPlugin(),
  //   new HtmlWebpackPlugin({
  //     template: "./src/index.html",
  //   }),
  //   new MiniCssExtractPlugin({
  //     filename: "css/[name].[chunkhash].css",
  //   }),
  // ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new  TerserPlugin({ // 使用TerserPlugin进行代码混淆
        //minify: TerserPlugin.esbuildMinify,
        terserOptions: {
         mangle: true,  // 混淆变量名
         //compress: true,
      },
    })],
  },
}; 