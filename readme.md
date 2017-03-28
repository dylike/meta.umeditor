# angular_umeditor

Umeditor 的 AngularJs插件

## 介绍

由于项目需要使用到富文本编辑器，决定使用百度提供的UMEditor.

>***UMeditor***,简称UM,是为满足广大门户网站对于简单发帖框，或者回复框需求所定制的在线富文本编辑器。 UM的主要特点就是容量和加载速度上的改变，主文件的代码量为139k，而且放弃了使用传统的iframe模式，采用了div的加载方式， 以达到更快的加载速度和零加载失败率。现在UM的第一个使用者是百度贴吧，贴吧每天几亿的pv是对UM各种指标的最好测试平台。 当然随着代码的减少，UM的功能对于UE来说还是有所减少，但我们经过调研和大家对于UM提出的各种意见，提供了现在UM的功能版本， 虽然有删减，但也有增加，比如拖拽图片上传，chrome的图片拖动改变大小等。让UM能在功能和体积上达到一个平衡。UM还会提供 CDN方式，减少大家部署的成本。我们的目标不仅是要提高在线编辑的编辑体验，也希望能改变前端技术中关于富文本技术的门槛，让大家不再觉得这块是个大坑。

本项目依赖[UMEditor 1.2.3](http://ueditor.baidu.com/website/umeditor.html), 依赖[AngularJs 1.x](https://angularjs.org/)

SimpleDemo(http://dylike.github.io/meta.umeditor/)

## 安装

```
bower install meta.umeditor
```

## 特性

1. 默认自动生成id：
2. 提示文案：`<script meta-umeditor metaUmeditorPlaceholder="your placeholder"></script>`
3. 全局一键配置：
```javascript
angular.module('your app').value('metaUmeditorConfig', {
    //UMEditor Config
    ......
})
```

## 使用

1. `bower install meta.umeditor`下载安装.

2. 在html文件中添加引用.

```html
    <!-- 引入umeditor的样式文件 -->
    <link href='/path/to/umeditor.css'>

    <!-- 引入umeditor需要的jquery库文件 -->
    <script src='/path/to/jquery'></script>

    <!-- 引入umeditor的核心文件 -->
    <script src='/path/to/umeditor'></script>

    <!-- 引入umeditor的配置文件 -->
    <script src='/path/to/umeditor.config'></script>

    <!-- 引入meta.umeditor的文件 -->
    <script src='/path/to/meta.umeditor'>
```

3. 在你的app中引入此模块
```javascript
    angular.module('your app', ['meta.umeditor'])
```


4. 在你的页面中使用
```html
    <!-- meta-umeditor-config 为umeditor的局域配置, 对应$scope中的变量名 -->
    <!-- meta-umeditor-placeholder 为提示文案 -->
    <script type="text/html" ng-model='ngModel' meta-umeditor meta-umeditor-config="umeditorConfig" meta-umeditor-placeholder='提示文案...'></script>.
```

## 作者

[dylike](http://blog.dylike.com/)
