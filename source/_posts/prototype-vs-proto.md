---
title: prototype 和 __proto__
date: 2018-06-30 16:12:48
tags:
- js
---

prototype 只是原型的英文单词。而在实际的浏览器中，使用 `__proto__` 来指向一个对象的原型。

## 继承(extends)

受中文的影响，在我最早接触继承时候，以为是类似法律中那种继承关系：

> 继承是法律基本名词，继承法即关于自然人死后由其继承人对其财产权利和义务予以承受的法律规范的总称。

让我最开始认为：子类 extends 父类之后，子类就**拥有**了父类中的属性 or 方法。然而实际上是错的：不管是 java 或者 js，编译后的代码中，子类中是并没有存在一份和父类一模一样的代码。

js 中的继承不是传统意义上经典继承模型（如 java/c/c++）。而是一种基于原型(prototype)的继承模型。

## 原型(prototype)

在一些文章中，画原型链的图时，经常用到 protoytpe 这个单词。但是同时由于 js 中的构造函数(Function/Object/Arrary 属于原生的构造函数)也拥有 prototype 这个**属性**，常常会给初学者造成一些困扰。现在把这些区分开画一个图，应该会比较清晰吧。

## 属性`prototype` 和 属性`__proto__`

这里讲的是作为对象属性的 `prototype` 和 `__proto__`。

### `prototype`

由于 js 中并没有经典的 class 类模型，而是使用 function 这个关键字作为 `构造类`的方式。

```js
var A = function B() {
  this.name = "a";
};
new A();
```

### `__proto__`

普通的对象是没有 `prototype` 这个属性的（除非你自己定义了 `a.prototype = 123`）。但所有的 普通对象都有 `__proto__`这个**私有**属性：
MDN 中有[这样一段](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain#Inheritance_with_the_prototype_chain)：

> This is equivalent to the JavaScript property `__proto__` which is non-standard but de-facto implemented by many browsers.

> 这个等同于 JavaScript 的非标准但许多浏览器实现的属性 `__proto__`。

(就是说，`__proto__`是浏览器厂商们自己加的)
所以，就可以确定了。一个`object`的原型就是 `object.__proto__`。

## 基于原型的继承

## 附

- [Inheritance and the prototype chain - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
