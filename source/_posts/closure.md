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

### 附

- [阮一峰老师の闭包](http://www.ruanyifeng.com/blog/2009/08/learning_javascript_closures.html)
- [MDN 上的解释](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
