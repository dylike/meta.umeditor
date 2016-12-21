/**
 * Created by dylike.
 */
angular.module('meta.umeditor', [])
    .value('metaUmeditorConfig', {
        //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
        toolbar: ['source undo redo bold italic underline'],
        //focus时自动清空初始化时的内容
        autoClearinitialContent: true,
        //关闭字数统计
        wordCount: false,
        //关闭elementPath
        elementPathEnabled: false,
        //frame高度
        //initialFrameHeight: 300
    })
    .directive('metaUmeditor', ['metaUmeditorConfig', function (metaUmeditorConfig) {
        'use strict';

        return {
            restrict: 'AE',
            scope: {
                scopeConfig: '=metaUmeditorConfig'
            },
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attrs, ngModel) {

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
                        attrs.$set('id', 'metaUmeditor-' + Math.floor(Math.random() * 100).toString() + new Date().getTime().toString());
                    }

                    ctrl.createEditor();

                    //重载ngModel的$render方法
                    ngModel.$render = function () {
                        if (ctrl.initialized) {
                            /**
                             * 重载ngModel的$render方法
                             */
                            ctrl.editorInstance.setContent(ngModel.$viewValue || '');
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
                            ctrl.initListener();
                            ngModel.$render();
                            ctrl.updateModelView();
                        });
                    }
                };

                //监听多个事件
                ctrl.initListener = function () {
                    ctrl.editorInstance.addListener('contentChange', function () {
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
                        angular.element('#' + attrs['id']).parent();
                    if (ctrl.focus || ctrl.editorInstance.hasContents()) {
                        parent.children('.metaUmeditorPlaceholder').remove();
                    } else {
                        parent.css('position', 'relative').append('<div class="metaUmeditorPlaceholder" style="position:absolute;top:0;left:0;padding:0 10px;line-height: 24px;color:#ccc">' + ctrl.placeholder + '</div>')
                    }
                };

                ctrl.init();
            }
        }
    }]);

