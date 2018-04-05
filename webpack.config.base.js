const webpack = require('webpack')

const BASE_PLUGINS = [
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  })
]

module.exports = {
  entry: [
    './src/index'
  ],
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: BASE_PLUGINS,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }]
      },
      {
        test: /\.css$/,
        use: [ 'style-loader',
               {
                 loader: 'css-loader'
               }
             ]
      }
    ]
  }
};
