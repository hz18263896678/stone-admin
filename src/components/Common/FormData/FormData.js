module.exports = {
    name: 'list',
    data() {
        return {
            checkall_temp: '_checkall_temp',

            fields: this.FieldList || [],
            editor: this.Editor || {},
            submit_data: this.DefaultValue || {},
            rules: this.Rules || {},

            /**
             * 富文本编辑器信息
             * @type {Object}
             */
            wangEditor: {
                //存富文本实例的对象，支持多个
                //key为富文本对象ID，value为实例
                editor: {},
                //默认为单个编辑器,如果为多个，此值为true，因为多个编辑器时，地图菜单不可用
                many: false,
                has: false,
                //默认显示菜单，支持自定义
                bar: [
                    'source', '|',
                    'bold',
                    'underline',
                    'italic',
                    'strikethrough',
                    'eraser',
                    'forecolor',
                    'bgcolor', '|',
                    'quote',
                    'fontfamily',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright', '|',
                    'link',
                    'unlink',
                    'table',
                    'emotion', '|',
                    'img',
                    'video',
                    // 'location',
                    'insertcode', '|',
                    'undo',
                    'redo',
                    'fullscreen'
                ],
                temp: {

                },
            },
        }
    },
    methods: {
        /**
         * 初始化编辑器
         * @param  {string} id     编辑器ID属性
         * @param  {object} config 初始化配置
         * @return {object}        所有编辑器所在对象，属性已ID为key
         */
        initEditor(id, config) {
            if (id) {
                this.wangEditor.editor[id] = new wangEditor(id);
                this.wangEditor.temp[id] = {
                    html: '',
                    text: ''
                };
            }
            this.configEditor(id, config).eventEditor(id).createEditor(id);
        },


        /**
         * 配置编辑器参数
         * @param  {string} id     编辑器ID
         * @param  {object} config 编辑器配置信息
         */
        configEditor(id, config) {
            if (id && config) {
                this.wangEditor.editor[id].config.uploadImgFileName = config.name || this.editor.name || 'sls-admin';
                this.wangEditor.editor[id].config.uploadImgUrl = config.url || this.editor.url || '';
                this.wangEditor.editor[id].config.uploadParams = config.params || this.editor.params || {};
                this.wangEditor.editor[id].config.hideLinkImg = true;
                this.wangEditor.editor[id].config.uploadImgFileName  = 'file';
                /**
                 * 显示的菜单，分四种情况
                 * 1-只传显示的菜单，直接赋值
                 * 2-只传隐藏的菜单，过滤不需要显示的
                 * 3-显示隐藏都传了,显示优先级高于隐藏优先级
                 * 4-啥都不传，取默认全部显示
                 * @type {object}
                 */
                if (Array.isArray(config.show_bar) && config.show_bar.length) {
                    var bar = config.show_bar;
                } else if (Array.isArray(config.hide_bar) && config.hide_bar.length) {
                    var bar = this.wangEditor.bar.filter((item) => {
                        return config.hide_bar.indexOf(item) === -1;
                    });
                } else if (Array.isArray(this.editor.show_bar) && this.editor.show_bar.length) {
                    var bar = this.editor.show_bar;
                } else if (Array.isArray(this.editor.hide_bar) && this.editor.hide_bar.length) {
                    var bar = this.wangEditor.bar.filter((item) => {
                        return this.editor.hide_bar.indexOf(item) === -1;
                    });
                } else {
                    var bar = this.wangEditor.bar;
                }

                if (this.wangEditor.many === true && bar.indexOf('location') !== -1) {
                    var bar = bar.splice(bar.indexOf('location'), 1);
                }

                this.wangEditor.editor[id].config.menus = bar;
            }

            return this;
        },


        /**
         * 编辑器常用事件
         * @param  {string} id 编辑器ID
         */
        eventEditor(id) {
            var self = this;
            this.wangEditor.editor[id].config.uploadImgFns.onload = function(data) {
                if (data.code === 200) {
                    var originalName = this.uploadImgOriginalName || '';

                    this.command(null, 'insertHtml', '<img src="' + data.obj.uri + '" alt="' + originalName + '" style="max-width:100%;"/>');
                } else {
                    if (data.status === 404) {
                        self.$message.error('上传错误信息：token无效！');
                    } else {
                        self.$message.error('上传错误信息：' + data.msg);
                    }
                }

            };

            this.wangEditor.editor[id].config.uploadImgFns.onerror = (xhr) => {
                this.$message.error('上传错误信息：网络错误！');
            };

            this.wangEditor.editor[id].onchange = function() {
                var text = this.$txt.text().replace(/(^\s*)|(\s*$)/g, ""),
                    html = this.$txt.html();

                self.wangEditor.temp[id].html = html;
                self.wangEditor.temp[id].text = text;

                self.$emit('onEditorChange', {
                    id,
                    data: {
                        html,
                        text
                    }
                });
            };

            return this;
        },


        /**
         * 创建编辑器
         * @param  {string} id 编辑器ID
         */
        createEditor(id) {
            this.wangEditor.editor[id].create();
        },


        /**
         * 从字段列表中提取出来表单字段
         * @return {object} [表单需要的字段]
         */
        deepObj() {
            if (this.fields) {
                var fields = this.fields,
                    k = 0,
                    update = this.submit_data.id ? true : false;
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];

                    if (field.value && field.value.constructor === Object) {
                        if (field.checkall && typeof field.checkall === 'object') {
                            var temp = {};
                            temp.text = field.checkall.text;
                            temp.value = field.checkall.value;
                            temp.indeterminate = field.checkall.indeterminate;
                            temp.checkbox_list = field.value.list;
                            temp.checkbox_value = field.value.default;
                            this.$set(this.submit_data, field.key + this.checkall_temp, temp);
                        } else {
                            this.$set(this.submit_data, field.key, field.value.default);
                        }
                    } else {
                        this.$set(this.submit_data, field.key, field.value);
                    }


                    if (field.type && field.type === 'editor') {
                        k++;
                        this.initEditor(field.id, field.config || {});
                        if (k == 2) {
                            this.wangEditor.many = true;
                        }
                        if (k == 1) {
                            this.wangEditor.has = true;
                        }
                    }
                }

            }
        },


        /**
         * 表单提交事件
         */
        onSubmit(ref) {
            var data = {
                data: this.submit_data,
            };
            if (this.wangEditor.has === true) {
                data.editor_temp_data = this.wangEditor.temp;
            }

            if (this.rules) {
                this.$refs[ref].validate((valid) => {
                    if (valid) {
                        this.$emit('onSubmit', data);
                    }
                });
            } else {
                this.$emit('onSubmit', data);
            }
        },


        onCheckboxChange(key) {
            var checkall_temp = this.submit_data[key + this.checkall_temp];

            if (checkall_temp.checkbox_value.length > 0 && checkall_temp.checkbox_value.length < checkall_temp.checkbox_list.length) {
                checkall_temp.indeterminate = true;
            } else {
                checkall_temp.indeterminate = false;
            }

            checkall_temp.value = checkall_temp.checkbox_value.length === checkall_temp.checkbox_list.length;
        },


        onCheckallChange(key) {
            var checkall_temp = this.submit_data[key + this.checkall_temp];
            checkall_temp.indeterminate = false;

            var value = [];
            if (checkall_temp.value == true) {
                for (var i = 0; i < checkall_temp.checkbox_list.length; i++) {
                    value.push(checkall_temp.checkbox_list[i].value);
                }
            }

            checkall_temp.checkbox_value = value;
        }
    },


    /**
     * ready
     */
    mounted() {
        this.deepObj();
    },


    /**
     * 接收参数
     * @type {Object}
     */
    props: {
        FieldList: {
            type: Array,
            required: true
        },
        Editor: {
            type: Object
        },
        Rules: {
            type: Object
        },
        DefaultValue: {
            type: Object
        }
    },


    /**
     * 监控参数
     * @type {Object}
     */
    watch: {
        FieldList(v) {
            if (v) {
                this.fields = v;
            }
        },
        DefaultValue(v) {
            if (v) {
                this.submit_data = v;
            }
        }
    }
}
