/**
 * Created by dylike.
 */
angular.module('meta.umeditor', []).value('metaUmeditorConfig', {
    //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
    toolbar: ['source undo redo bold italic underline'],
    //focus时自动清空初始化时的内容
    autoClearinitialContent: true,
    //关闭字数统计
    wordCount: false,
    //关闭elementPath
    elementPathEnabled: false
    //frame高度
    //initialFrameHeight: 300
}).directive('metaUmeditor', [
    'metaUmeditorConfig', function (metaUmeditorConfig) {
        'use strict';

        return {
            restrict: 'AE',
            scope: {
                scopeConfig: '=metaUmeditorConfig'
            },
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModel) {

                try {
                    if (UM) {}
                } catch (e) {
                    console.error(
                        'Can not find UM, You should import the UMEditor library!');
                    return;
                }

                //获取全局配置,为空
                var config = scope.scopeConfig || metaUmeditorConfig;

                var ctrl = {
                    initialized: false,
                    editorInstance: null,
                    placeholder: attrs['metaUmeditorPlaceholder'] || '',
                    focus: false
                };

                ctrl.init = function () {

                    //创建id
                    if (!attrs.id) {
                        attrs.$set('id',
                            'metaUmeditor-' +
                            Math.floor(Math.random() * 100).toString() +
                            new Date().getTime().toString());
                    }

                    ctrl.createEditor();

                    //重载ngModel的$render方法
                    ngModel.$render = function () {
                        if (ctrl.initialized) {
                            /**
                             * 重载ngModel的$render方法
                             */
                            ctrl.editorInstance.setContent(
                                ngModel.$viewValue || '');
                            ctrl.checkPlaceholder();
                        }
                    };

                    //重载ngModel的isEmpty方法
                    ngModel.$isEmpty = function (value) {
                        if (!value) {
                            return true;
                        }
                        if (ctrl.initialized) {
                            return !ctrl.editorInstance.hasContents();
                        }
                    };
                };

                //创建一个UMEditor实例
                ctrl.createEditor = function () {
                    if (!ctrl.initialized) {
                        ctrl.editorInstance = UM.getEditor(attrs['id'], config);
                        ctrl.editorInstance.ready(function () {
                            ctrl.initialized = true;
                            /**
                             * 在初始化时,调用ngModel的$render
                             * 直接渲染ngModel的值到 editorInstance
                             */
                            ngModel.$render();
                            ctrl.initListener();
                            ctrl.checkPlaceholder();
                        });
                    }
                };

                //监听多个事件
                ctrl.initListener = function () {
                    ctrl.editorInstance.addListener('contentChange',
                        function () {
                            scope.$evalAsync(ctrl.updateModelView);
                        });
                    ctrl.editorInstance.addListener('focus', function () {
                        ctrl.focus = true;
                        ctrl.checkPlaceholder();
                    });
                    ctrl.editorInstance.addListener('blur', function () {
                        ctrl.focus = false;
                        ctrl.checkPlaceholder();
                    });
                };

                //修改ngModel Value
                ctrl.updateModelView = function () {
                    var modelContent = ctrl.editorInstance.getContent();
                    ngModel.$setViewValue(modelContent);
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }
                };

                //监测是否需要placeholder
                ctrl.checkPlaceholder = function () {
                    var parent =
                        document.getElementById(attrs['id']).parentNode;
                    if (ctrl.focus || (ngModel.$viewValue &&
                        ctrl.editorInstance.hasContents())) {
                        var _dom = parent.getElementsByClassName(
                            'metaUmeditorPlaceholder')[0];
                        if (_dom) {
                            parent.removeChild(_dom);
                        }
                    } else {
                        parent.style.position = 'relative';
                        var _dom = document.createElement('div');
                        _dom.className = 'metaUmeditorPlaceholder';
                        _dom.style.position = 'absolute';
                        _dom.style.top = 0;
                        _dom.style.left = 0;
                        _dom.style.padding = '0 10px';
                        _dom.style.lineHeight = '24px';
                        _dom.style.color = '#ccc';
                        _dom.innerText = ctrl.placeholder;
                        parent.appendChild(_dom);
                    }
                };

                ctrl.init();
            }
        };
    }]);

