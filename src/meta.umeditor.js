/**
 * Created by dylike.
 */

angular.module('meta.umeditor', [])
    .directive('metaUmeditor', function () {
        return {
            restrict: 'AE',
            scope: {
                config: '=metaUmeditorConfig'
            },
            require: 'ngModel',
            transclude: true,
            link: function (scope, element, attr, ngModel) {
                //获取当前的DOM元素
                var _dom = element[0];

                var _id = '_' + Math.floor(Math.random() * 100).toString() + new Date().getTime().toString();

                var _placeholder = '<p style="font-size:14px;color:#ccc;">' +
                    attr.metaUmeditorPlaceholder +
                    '</p>';

                var _config = scope.config || {
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
                    };

                _dom.setAttribute('id', _id);

                var _umeditor = UM.getEditor(_id, _config);

                /**
                 * 对于umeditor添加内容改变事件，内容改变触发ngModel改变.
                 */
                var editorToModel = function () {
                    if (_umeditor.hasContents())
                        ngModel.$setViewValue(_umeditor.getContent());
                    else
                        ngModel.$setViewValue(undefined);
                };

                /**
                 * umeditor准备就绪后，执行逻辑
                 * 如果ngModel存在
                 *   则给在编辑器中赋值
                 *   给编辑器添加内容改变的监听事件.
                 * 如果不存在
                 *   则写入提示文案
                 */

                _umeditor.ready(function () {
                    if (ngModel.$viewValue) {
                        _umeditor.setContent(ngModel.$viewValue);
                        _umeditor.addListener('contentChange', editorToModel);
                    } else {
                        _umeditor.setContent(_placeholder);
                    }
                    //_umeditor.execCommand('fontsize', '32px');
                    //_umeditor.execCommand('fontfamily', '"Microsoft YaHei","微软雅黑"')
                });

                /**
                 * 添加编辑器被选中事件
                 * 如果ngModel没有赋值
                 *   清空content
                 *   给编辑器添加内容改变的监听事件
                 */
                _umeditor.addListener('focus', function () {
                    if (!ngModel.$viewValue) {
                        _umeditor.setContent('');
                        _umeditor.addListener('contentChange', editorToModel);
                    }
                });


                /**
                 * 添加编辑器取消选中事件
                 * 如content值为空
                 *   取消内容改变的监听事件
                 *   添加content为提示文案
                 */
                _umeditor.addListener('blur', function () {
                    if (!_umeditor.hasContents()) {
                        _umeditor.removeListener('contentChange', editorToModel);
                        _umeditor.setContent(_placeholder);
                    } else {
                    }
                })

            }
        }
    });

