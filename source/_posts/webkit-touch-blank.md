---
title: IOS下-webkit-overflow-scrolling:touch滚动引发页面空白
date: 2018-02-05 16:29:28
tags:
- ios
---

ios中，我们会在css中使用 `-webkit-overflow-scrolling:touch` 来使元素的滚动更加顺滑。但是偶尔也会造成滚动时候，部分元素“未渲染”，呈现出空白。

为了解决这个问题，可以尝试：

(A元素：添加了`-webkit-overflow-scrolling:touch`) 
1. 重置A元素所有子元素的 `-webkit-overflow-scrolling` 属性为 `unset`
2. 扩大A元素子元素的高度。(可以通过 **将多个子元素放在一个div中** 的方式扩大)
