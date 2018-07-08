---
title: commonjs
date: 2018-07-08 16:12:10
tags:
- js
- commonjs
- modular
---

前端模块化开发中少不了用到 `module.exports` `require` 这一对兄弟。有时候看别人代码还会看到 `exports`。现在来深入研究下这几个小东西。

## 来源

首先，需要明确一点：`module.exports` `require` `exports` 这 3 个是 [commonjs 规范](http://wiki.commonjs.org/wiki/CommonJS)中的模块化规则，而[node 采用了这个规范](https://nodejs.org/docs/latest/api/modules.html) 来实现自己的模块化系统（原因：服务器端的代码通常都是在服务器磁盘上的且不易变更，而 commonjs 正好是同步加载模块）。

---

## 一个简单的例子

为了方便，我们从一个简单的计算器工具开始：

```js
// calc.js

module.exports.square = num => num * num;
```

使用：

```js
// use-calc.js

const calc = require("./calc.js");
console.log(calc.square(2)); // 4
```

## `module` 对象

为了明白 `module` 这个变量是什么，我们对 `calc.js` 进行简单的修改：

```diff
// calc.js

module.exports.square = num => num * num;
+ console.log(module);
```

当执行 `require("./calc.js")` 的时候，会输出类似下面的东西：

```js
Module {
  id: '/path-to/calc.js',
  exports: { square: [Function] },
  parent:[
    Module { ... }
  ]
  filename: '/path-to/calc.js',
  loaded: false,
  children: [],
  paths: [ ... ]
}
```

## `module.exports`

从上面的输出很容易能看出：

- `module.exports` 只是 Module 对象的一个属性。
- 这个属性由 nodejs 定义。
- 这个属性的值完全由我们自己定义。
- 默认值是空对象。

因此我们有两种使用方式：

1.  直接在这个属性的默认值（空对象）上添加属性： 就像上面的例子 `module.exports.square = [Fucntion]`。
2.  用我们自定义的其他变量替换: `module.exports = OtherVariable`。

替换的话，就可以替换为任意类型的变量，如：Number、String、Class 等。

## 别名：`exports`

- `exports` 是一个变量，但它只是 `module.exports` 的一个别名，只是为了让我们在代码里少写几个字母。
- `exports` 的有效导出只有这一种用法： `exports.xxx = [Something]`。

下面是正常可用的导出方式：

```diff
// calc.js

- module.exports.square = num => num * num;
- console.log(module);
+ exports.square = num => num * num;
```

但是如果改为下面的写法，那么 use-calc.js 中只能得到一个空对象：

```diff
// calc.js

- module.exports.square = num => num * num;
- console.log(module);
+ exports = {
+   square: num => num * num
+ }
```

如果有点疑惑，只要明白这个就好了：

- `require()` 导出时候，是从 `module` 对象中查找导出内容的。
- `exports` 只是 nodejs 声明的一个模块级别的变量。
- `exports` 的初始值只是指向了 `module.exports`, 它可以被任意赋值。但被赋值的同时，它也不再指向 `module.exports` 了。
- `exports` 的初始化发生在模块执行前。

可以理解为模块文件的顶部有这么一句代码：`exports = module.exports;`

```js
exports = module.exports = { name: "Jack" };
exports.gender = "male"; // 此时修改的是 module.exports 指向的对象。
exports = { name: "John" }; // 此时直接将 exports 指向了其他对象，并未对原module.exports产生任何影响。
```

如果你能明白下面这段代码能输出什么，你基本就明白了 exports 和 module.exports 的规则了：

```js
// run.js
const M = require(./c-module.js);
console.log(M);
```

```js
// c-module.js
// 情况1：
module.exports.count = 1;
exports.count = 2;

// 情况2：
exports.count = 1;
module.exports.count = 2;

// 情况3：
module.exports = { count: 1 };
exports.count = 2;
exports = { count: 3 };
```

## 结论

- `module.exports` 只是模块作用域变量 `module` 的一个属性，默认值是一个空对象，但可以被任意赋值修改。
- 模块作用域变量 `exports` 只是一个初始值被指向了 `module.exports` 的变量。

同时 nodejs 的文档中也写明了：

> As a guideline, if the relationship between exports and module.exports seems like magic to you, ignore exports and only use module.exports.
> 如果你不清楚 exports 和 module.exports 之间的关系，那就不要用 exports 了，只管用 module.exports 就行了。

# 附

- 本文部分内容译自 [node-js-module-exports-vs-exports - lazlojuly](https://medium.freecodecamp.org/node-js-module-exports-vs-exports-ec7e254d63ac)
