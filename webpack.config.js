const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// module.exports dev/prod common
const common = {
  entry: {
    app: "./src/index.js"
  },
  output: {
    path: __dirname + '/dist',
    filename: "[name].js"
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              url: false,
              importLoaders: 2
            },
          },
          'sass-loader',
          {
            loader: 'postcss-loader',
            options: {
              // PostCSS側でもソースマップを有効にする
              plugins: [
                // Autoprefixerを有効化
                // ベンダープレフィックスを自動付与する
                require('autoprefixer')({
                  grid: true
                })
              ]
            }
          }]
        })
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css'
    })
  ]
}



// for development
if(process.env.NODE_ENV === 'development') {
  module.exports = merge(common, {
    mode: "development",
    devtool: "#inline-source-map",
    devServer: {
      contentBase: __dirname + '/dist',
      port: 8080,
      publicPath: '/'
    }
  })
}

// for production
if(process.env.NODE_ENV === 'production') {
  module.exports = merge(common, {
    devtool: "source-map",
    plugins: [
      new UglifyJSPlugin()
    ]
  })
}
