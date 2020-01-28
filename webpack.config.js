const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const buildPath = path.resolve(__dirname, "build");

module.exports = {
  entry: "./index.js",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  output: {
    filename: "bundle.js",
    path: buildPath
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: "./index.html",
        to: "./index.html"
      }
    ])
  ],
  devServer: {
    contentBase: buildPath,
    compress: true,
    port: 9000
  }
};
