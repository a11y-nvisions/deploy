'use strict';
import path from 'path';

const __dirname = path.resolve();

export default {
  entry: './src/index.js',
  mode:'development',
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'customCheckbox.js',
    environment:{
      arrowFunction:false
    }
  },
  module: {
    rules: [
      {
        test:/\.scss$/,
        exclude:/node_modules/,
        include:/style/,
        use:[
          'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        use:[
          'file-loader?name=assets/[name].[hash].[ext]'
        ]
      },
      {
        test: /\.js/,
        exclude:/node_modules/,
        use:[
          {
            loader:'babel-loader',
            options:{
              presets:[
                ["@babel/preset-env",{
                  corejs:3,
                  useBuiltIns:'entry',
                  targets: {
                    safari: '10',
                    ie: '11',
                  }
                }]
              ],
              plugins:[
                "@babel/plugin-transform-template-literals",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-parameters",
                '@babel/plugin-transform-classes'
              ],
            }
          },
        ]
      }
    ]
  },
};
