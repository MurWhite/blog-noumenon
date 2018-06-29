---
title: let 和 var
date: 2018-06-29 22:41:39
tags:
- js
- es6
---

我认为 js 中的变量是有生命周期的： 声明->初始化->赋值->销毁。当然，赋值阶段是可以不断重新赋值的。

### var 的变量提升

```js
console.log(a); // undefined
var a = 1;
console.log(a); // 1

// 由于var存在变量提升，相当于以下写法
(declare a) && (a = undefined); // 声明并初始化为 undefined
console.log(a); // undefined
a = 1; // 赋值 a 为 1
console.log(a); // 1
```

### let 的块级作用域

```js
console.log(a); // Uncaught ReferenceError: a is not defined
let a;
console.log(a);
a = 1;
console.log(a);
```

上面这段代码是没办法执行的，因为第一行已经报错了。如果我们将它 catch 住，继续执行后面的：

```js
try {
  console.log(a);
} catch (e) {
  console.log(e);
}
let a;
console.log(a);
a = 1;
console.log(a);

// 由于let的块级作用域问题，相当于以下写法
declare a; // 仅仅是声明，并未给a初始化
try {
  console.log(a); // Throw an Error
} catch (e) {
  console.log(e); // Uncaught ReferenceError: a is not defined
}
a = undefined;  // 初始化 a 为undefined
console.log(a); // undefined
a = 1;  // 赋值 a 为1
console.log(a); // 1
```

### 结论

通过以上两个对比，能看出来不管是 var or let，都存在变量提升。区别是：

- var 会将变量的声明和初始化一并提升至作用域头部。
- let 仅将变量的声明提升至作用域头部。

然后再看看下面这两个例子，应该差不多就懂了：

```js
var name = "Alice";
function sayName() {
  console.log(name);
  let name = "Bob";
}
sayName();
```

```js
let name = "Alice";
function sayName() {
  console.log(name);
  var name = "Bob";
}
sayName();
```
