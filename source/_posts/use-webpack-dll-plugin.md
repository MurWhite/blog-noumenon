---
title: webpack dll-plugin 的使用方法
date: 2017-09-20 14:26:11
tags:
- webpack
---

dll需要一份单独的webpack打包配置
``` javascript
module.exports = {
  entry: {
    dlls: ['vue', '其他第三方包']
  },
  output: {
    path: path.resolve(__dirname, './dist/dlls/'),
    filename: '[name].js',
    library: '[name]_[hash:6]'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/dlls/", "[name].manifest.json"),
      name: "[name]",
      context: __dirname
    })
  ]
}
```
在html中添加其他script前添加
``` html
<script type="text/javascript" src="dlls.js的路径"></script>
```
