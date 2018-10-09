---
title: 闭包 closure
date: 2018-06-28 23:53:20
tags:
  - js
---

闭包在网上有各种各样的解释，就像是哈姆雷特一样。

个人偏向 [MDN 的解释](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)。

> A closure is the combination of a function and the lexical environment within which that function was declared.
> 闭包是函数和声明该函数的词法环境的组合。

我理解的是，闭包描述的是一种现象 phenomenon 。由于 js 存在作用域链的机制，导致一些函数在**声明**时使用了(n 级)祖先作用域的变量。我强调了声明，是因为看到了 MDN 解释中的[这一句](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures#Closure)：

> Running this code has exactly the same effect as the previous example of the init() function above; what's different — and interesting — is that the displayName() inner function is returned from the outer function **before being executed**.

重点在于：函数在**执行前**被返回。
下面看一段函数：

```js
function sayHello(name) {
  return function() {
    console.log("hello" + name);
  };
}
let greet = sayHello("John");
greet();
```

这是经典的闭包例子。上面代码中在执行前被返回匿名函数 `function anonymous(){console.log("hello" + name)}` 与其所在的词法环境(fucntion sayHello)组合成为一个闭包。

同时，也经常看到一个没有利用闭包造成的反例：

```js
// 预期结果是1秒后输出 0,1,2,3...9
for (var i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// 然而，实际是最后输出了 10 个 10
```

分析时需要知道的是，for + var 并没有自己的作用域 scope，上面的 for 循环相当于以下写法：

```js
// 循环开始前准备（注意，var是没有块级作用域的）
var i = 0;

// 循环体
if(i < 10){
  setTimeout(/*function-console*/, 1000)
}
// 循环体的后操作
i++;

// 下一个循环体及后操作
if(i < 10){
  setTimeout(/*function-console*/, 1000)
}
i++;

//再重复几次循环体及后操作
```

而每次 setTimeout 的时候，第一个入参为一个函数，由于 if 内没有自己的 scope，此函数使用了全局变量 i。声明的时候，function-console 并没有和它所在的环境形成闭包。同时，由于 JS 单线程的机制，function-console 是在 1000ms 后才被推入事件队列中，而此时，全局变量的 i 早已经变为了 10。

如果改为一下使用 let 的写法：

```js
for (let i = 0; i < 10; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// 就能得到预期的输出
```

这是因为 let 在 for 中形成了一个块级作用域，相当于以下写法。

```js
{
  // 循环开始前准备
  let i = 0;

  // 循环体
  if(i < 10){
    let temp_i = i;
    setTimeout(/*function-console, use temp_i*/, 1000)
  }
  // 循环体的后操作
  i++;

  // 下一个循环体及后操作
  if(i < 10){
    let temp_i = i;
    setTimeout(/*function-console, use temp_i*/, 1000)
  }
  i++;

  //再重复几次循环体及后操作
}
```

### 附

- [阮一峰老师の闭包](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
- [MDN 上的解释](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
