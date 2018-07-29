---
title: (译) CommonJS Modules 规范
date: 2018-07-12 23:46:54
tags:
- commonjs
- specification
- 翻译
---

> 规范原文：[CommonJS Modules 1.0](http://www.commonjs.org/specs/modules/1.0/)

此文：按照 **个人理解** 翻译了一下 commonjs 规范

## 导语

此规范解决“如何编写能够在交互式模块化系统中使用的模块”。这个模块化系统可以是客户端系统或服务端系统、安全的系统或不安全系统、现在已有的系统或通过语法扩展而被支持的未来系统。这些模块不仅在各自的顶级作用域内拥有一些私有内容，而且能够从其他模块中导入单例对象，并能够导出自己内部的 API 给其他模块使用。换一种方式来说，此规范定义了一个模块化系统为了支持交互式模块所需要的最基本特性。

## 协议

### 模块上下文(Module Context)

1.  在一个模块中，有一个变量 `require`， 值指向了一个函数。
    1.  这个 `require` 函数接收一个参数：**模块的标识符**。
    2.  `require` 函数返回外部模块（即 1 中 **模块的标识符** 对应的模块）导出的 API。
    3.  **依赖循环/闭环(dependency cycle)** 的定义：一个模块 B 在完成它的初始化[2] 之前，`require`(依赖) 了一个此次依赖链中较为靠前的模块 A，此时发生的就叫做依赖循环。如果发生了依赖循环，那么模块 A 必须在模块 B 初始化之前，导出了模块 B 初始化所需要的内容。（有点绕：可以看下 [CommonJS in NodeJS#循环依赖](/2018/07/08/commonjs-in-nodejs/#循环依赖) 中的我的个人理解）
2.  在一个模块中，有一个变量 `exports`，值指向了一个对象，当模块在初始化的时候，可以向此模块中添加 API。
3.  模块必须使用 2 中的 `exports` 对象作为唯一的导出。

### 模块标识符(Module Identifiers)

1.  模块标识符是由 **正斜杠`/`** 分隔的多个 **术语`term`** 组成的字符串。
2.  一个 **术语`term`** 必须是：`驼峰式的标识符` 或 `.` 或 `..`。
3.  模块标识符可以不使用文件后缀名，如 `.js`。
4.  模块标识符可以是 **相对的** 或 **顶级的**。一个标识符如果以 `.` 或 `..` 开头，那么它就是 **相对的**。
5.  顶级标识符应当从模块的根命名空间开始解析。
6.  相对标识符应当从这个模块被 `require` 的模块位置开始解析。

[1] interoperable modules: 可交互式的模块。即：可以互相交换信息的模块。
[2] 初始化：即执行该模块。模块仅会在第一次被 require 的时候执行，以获得所导出的 API。之后再次被 require 的时候，会直接从内存中读取该内容。

### 未定义

此规范并未对以下交互式的内容进行定义：

1.  模块的存储方式：可以是数据库、文件件系统或工厂函数。但模块也可以通过链接库进行交互。
2.  模块是否支持通过 PATH 变量来对模块标识符进行解析。

## 单元测试

- [Unit Tests at Google Code](https://github.com/commonjs/commonjs/tree/master/tests) by Kris Kowal

## 示例代码

```js
// math.js
exports.add = function() {
  var sum = 0,
    i = 0,
    args = arguments,
    l = args.length;
  while (i < l) {
    sum += args[i++];
  }
  return sum;
};

// increment.js
var add = require("math").add;
exports.increment = function(val) {
  return add(val, 1);
};

// program.js;
var inc = require("increment").increment;
var a = 1;
inc(a); // 2
```

## 附

- [CommonJS Modules/1.0 规范 - JOB BOLE](http://blog.jobbole.com/49290/)
