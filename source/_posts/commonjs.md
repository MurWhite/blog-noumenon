---
title: commonjs
date: 2018-07-08 16:12:10
tags:
- js
- nodejs
- commonjs
- modular
---

前端模块化开发中少不了用到 `module.exports` `require` 这一对兄弟。有时候看别人代码还会看到 `exports`。现在来深入研究下这几个小东西。

## 来源

[commonjs 只是一个规范](http://wiki.commonjs.org/wiki/CommonJS)，而 node 采用了 commonjs 规范来实现自己的[模块化系统](https://nodejs.org/docs/latest/api/modules.html) （原因：服务器端的代码都在服务器的磁盘上，读取速度非常快，而 commonjs 的规则即是同步加载）。

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
const M = require("./c-module.js");
console.log(M);
```

```js
// 情况1-1的c-module.js：
module.exports = { count: 1 };
module.exports.name = 1;
// 情况1-2的c-module.js：
module.exports.name = 1;
module.exports = { count: 1 };

// 情况2的c-module.js：
module.exports.count = 1;
exports.count = 2;

// 情况3的c-module.js：
exports.count = 1;
module.exports.count = 2;

// 情况4的c-module.js：
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

# 循环依赖

commonjs 中对模块的循环引用是有[说明](http://wiki.commonjs.org/wiki/Modules/1.0#Module_Context)的：

> If there is a dependency cycle, the foreign module may not have finished executing at the time it is required by one of its transitive dependencies; in this case, the object returned by "require" must contain at least the exports that the foreign module has prepared before the call to require that led to the current module's execution.
> 如果出现依赖闭环(dependency cycle)，那么外部模块在被它的传递依赖（transitive dependencies）所 require 的时候可能并没有执行完成；在这种情况下，”require”返回的对象必须至少包含此外部模块在调用 require 函数（会进入当前模块执行环境）之前就已经准备完毕的输出。

可能看起来有点绕。看个下面的例子，基本就能清楚了：

```js
// a.js
console.log("a start");
module.exports.name = "a";
let b = require("./b");
console.log("a required b is:", b);
module.exports.b_required = true;
console.log("a end");

// b.js
console.log("b start");
module.exports.name = "b";
let a = require("./a");
console.log("b required a is:", a);
module.exports.a_required = true;
console.log("b end");

// main.js
console.log("main start");
let a = require("./a");
console.log("main required a is:", a);
let b = require("./b");
console.log("main required b is:", b);

// 执行 node main.js
```

执行：`node main.js` 可先按照自己的理解写一下打印顺序。
下面是输出结果：

```bash
main start
a start
b start
b required a is: { name: 'a' }
b end
a required b is: { name: 'b', a_required: true }
a end
main required a is: { name: 'a', b_required: true }
main required b is: { name: 'b', a_required: true }
```

如果你的答案和上面一样，那恭喜你了。如果不太一样，可以看下我的理解：

- 依赖闭环仅可能发生在 依赖/模块 的执行过程中（即第一次引用 依赖/模块 的时候）。
- 这个例子中的依赖链条是这样的：
  - main->a->b->a（产生了闭环，因为 a 和 b 都是第一次引用）
  - main->b（b 在第一次已经执行过了，此次并没有发生执行，所以不会产生闭环）

1.  在 a->b->a 执行过程中，a 执行到 require('./b') 的时候，会去执行 b 以期获得 b。
2.  b 执行到一半的时候，引用了 a。因为 b 此次依赖执行的祖先模块中有 a（意思就是 a 还没有执行完），于是发现了依赖闭环。
3.  于是，b 中对 a 的引用，便只返回 a 中已执行的部分（即 require('./b') 之前的内容）。

# 附

- 本文部分内容译自 [node-js-module-exports-vs-exports - lazlojuly](https://medium.freecodecamp.org/node-js-module-exports-vs-exports-ec7e254d63ac)
- [CommonJs Modules 1.0](http://www.commonjs.org/specs/modules/1.0/)
