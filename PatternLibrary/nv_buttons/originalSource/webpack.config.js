'use strict';
import path from 'path';

const __dirname = path.resolve();

export default {
  entry: './src/index.js',
  mode:'development',
  context: path.resolve(__dirname),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    environment:{
      arrowFunction:false
    }
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude:/node_modules/,
        use:[
          {
            loader:'babel-loader',
            options:{
              presets:[
                ["@babel/preset-env",{
                  corejs:3
                }]
              ],
              plugins:[
                "@babel/plugin-transform-template-literals",
                "@babel/plugin-transform-arrow-functions",
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-parameters"
              ],
            }
          }
        ]
      }
    ]
  },
};
