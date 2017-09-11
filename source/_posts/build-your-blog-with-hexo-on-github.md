---
title: Hexo + Github 搭建个人博客
date: 2017-09-11 19:05:22
tags:
- 博客搭建
---

## 概要

这是第一篇手写博客。

## 搭建博客步骤

此段落出现的变量：
- path/you/wanna/place/project : 项目所在文件夹的路径
- your-project-name : 本地项目的名称
- github-user-name : 个人在Github的用户名
- your-github-project-remote-url.git : clone Github上项目的仓库地址

注意：
- 本地项目名称和github上的项目名称没有任何关系
- 你可能需要把本地的项目在github上另做一份仓库保存

#### 1、安装Hexo

```bash
$ npm install -g hexo-cli 
```

#### 2、本地初始化项目

```bash
$ cd path/you/wanna/place/project 
$ hexo init your-project-name
$ cd your-project-name
$ npm install
```

#### 3、安装 hexo-deployer-git

```bash
$ npm install hexo-deployer-git --save 
```

#### 4、[Github](https://github.com)在上建立新项目 github-user-name.github.io

#### 5、修改本地项目

在_config.yml文件末尾修改如下
```$xslt
deploy:
  type: git
  repo: your-github-project-remote-url.git
  branch: master
```
#### 6、发布博客到Github

```bash
$ hexo d 
```
等待控制台信息打印完毕，可在 github-user-name.github.io 上看到默认的博客

## 新建一篇博客文章

```bash
$ hexo post "文章名称，建议英文"
```
然后根据提示，使用markdown语法编辑该文章。
- 修改完毕后，使用 `$ hexo d` 发布到github上即可。
- 如果需要本地预览，运行 `$ hexo s`，然后在 http://localhost:4000 即可看到博客主站

## 保存本地项目到Github

1、在github上建立一个仓库
2、本地运行 `npm init`

## 了解[HEXO](https://hexo.io)

- 在[官网了解_config.yml](https://hexo.io/zh-cn/docs/configuration.html)文件

### 2、