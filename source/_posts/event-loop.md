---
title: Event Loop
date: 2018-07-01 14:21:38
tags:
- js
---

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop) 中的解释很清晰。这里解释几个概念

## JS 单线程

JS 单线程指的是，JS 的执行运行时，有且仅会有一个线程执行（你在想什么? webworker 当然也是一个独立的 JS 单线程了！）。那么，一个线程是如何实现异步模型呢？

## 异步模型 - 浏览器端

先来张图。
![图 1](/images/event-loop/event-exec.svg)

### 执行完毕

这里必须要讲清楚这个概念。那么当单线程遇到了 `setTimeout(cb, 3000)` 的时候，JS 单线程要怎么处理呢？JS 单线程是不会像人一样：噢，我过 3 秒之后再来执行这个 cb 函数。因此当 JS 线程遇到它时，直接把它扔给浏览器，并标记为**执行完毕**，然后把它从执行栈里推出。浏览器自有对应的 WebAPI 去实现这个 `setTimeout(cb, interval)` ：

1.  浏览器注册一个定时器，并将回调函数 cb 注册到 EventTable 中。
2.  当定时器倒计时完毕，通知 EventTable，将 cb 扔进事件队列中。

### 恰当的时机、相应的队列

在上面的例子中，很容易就知道 3000ms 并不是 cb 执行的间隔，而是浏览器定时器倒计时（即 cb 加入事件队列）的时间。

事件队列中分为宏任务(Task)和微任务队列(JobsQueue)。他们的执行顺序可以用以下代码说明：

```js
while (There_is_sth_in_TaskQueue_or_JobsQueue) {
  while (There_is_sth_in_JobsQueue) {
    processNextJob();
  }
  processNextTask();
}
```

## 并发模型

首先，如果有需要，可以自行搜索下 `并发(Concurrency)` 的概念。
然后，在图 1 中，能够很明显的看到，由于这个 EventLoop 循环的存在，得以实现了诸多的异步操作 : 譬如 `setTimeout`、`document的点击事件` 等。也正是由于浏览器实现的这些 webApi，得以让这些 异步任务 能够在恰当的时机进入的事件队列中。继而实现了 JS 独有的并发模型。

## 附

- [Concurrency model and Event Loop - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop)
- [Understanding JS: The Event Loop - Alexander Kondov](https://hackernoon.com/understanding-js-the-event-loop-959beae3ac40)
- [Tasks, microtasks, queues and schedules - Jake Archibald](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)
