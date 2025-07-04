/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <section class="editor">
        <div class="preview" v-if="display">
            <div v-html="html" />
        </div>
        <div ref="editor" v-else />
    </section>
</template>

<script>
import { Message } from 'view-design';
import Emitter from 'view-design/src/mixins/emitter';
import WangEditor from 'wangeditor';
import * as utils from '@/utils';

export default {
    name: 'Editor',
    props: {
        value: Array,
        display: Boolean,
        dir: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            result: [],
            html: null
        };
    },
    mounted() {
        if (this.display) {
            return this.renderHtml();
        }

        this.editor = new WangEditor(this.$refs.editor);

        this.editor.config.placeholder = '请输入正文内容';
        this.editor.config.menus = [
            'head',
            'bold',
            'fontSize',
            'italic',
            'underline',
            'strikeThrough',
            'indent',
            'lineHeight',
            'foreColor',
            'backColor',
            'list',
            'justify',
            'quote',
            'image',
            'table',
            'splitLine',
            'undo',
            'redo'
        ];
        this.editor.config.zIndex = 50;
        this.editor.config.fontSizes = {
            'x-small': { name: '12px', value: '1' },
            small: { name: '13px', value: '2' },
            normal: { name: '14px', value: '3' },
            large: { name: '16px', value: '4' },
            'x-large': { name: '18px', value: '5' },
            'xx-large': { name: '20px', value: '6' },
            'xxx-large': { name: '22px', value: '7' }
        };
        this.editor.config.customAlert = (msg, type) => {
            switch (type) {
                case 'success':
                    Message.success(msg);
                    break;

                case 'info':
                    Message.info(msg);
                    break;

                case 'warning':
                    Message.warning(msg);
                    break;

                case 'error':
                    Message.error(msg);
                    break;

                default:
                    Message.info(msg);
                    break;
            }
        };

        this.editor.config.showLinkImg = false;
        this.editor.config.customUploadImg = (files, insertImg) => {
            let index = 0;
            const sender = index => {
                const file = files[index];

                // 使用统一上传服务
                utils.upload
                    .upload(file, {
                        dir: this.dir
                    })
                    .then(response => {
                        if (response.code === 200) {
                            insertImg(response.data.url);

                            if (index < files.length - 1) {
                                sender(++index);
                            }
                        } else {
                            throw new Error(response.message || '上传失败');
                        }
                    })
                    .catch(error => {
                        Message.error(`${file.name}上传失败: ${error.message}`);
                    });
            };

            sender(index);
        };

        this.editor.config.pasteFilterStyle = true;
        this.editor.config.pasteIgnoreImg = true;

        const trigger = () => {
            this.result = this.editor.txt.getJSON();
            this.$emit('input', this.result);
            this.$emit('on-change', this.result);
            this.dispatch('FormItem', 'on-form-change', this.result);
        };
        this.editor.config.onblur = () => {
            trigger();
        };
        this.editor.config.onchange = () => {
            trigger();
        };

        this.editor.create();
    },
    beforeDestroy() {
        if (!this.display) {
            this.editor.destroy();
            this.editor = null;
        }
    },
    mixins: [Emitter],
    methods: {
        renderHtml() {
            this.html = this.renderNodes(this.value);
        },
        renderNode(node) {
            if (typeof node === 'string') {
                if (node.indexOf('<br/>') > -1 || node.indexOf('<script>') > -1) {
                    return '';
                }

                return node;
            }

            const { tag, children, attrs } = node;
            const attrsArr = [];

            if (tag === 'script') {
                return '';
            }

            if (Array.isArray(attrs)) {
                attrs.forEach(({ name, value }) => {
                    attrsArr.push(`${name}="${value}"`);
                });
            }

            return `<${tag} ${attrsArr.join(' ')}>${this.renderNodes(children)}</${tag}>`;
        },
        renderNodes(nodes) {
            if (!Array.isArray(nodes)) {
                return '';
            }

            return nodes.map(item => this.renderNode(item)).join('');
        }
    },
    watch: {
        value: {
            deep: true,
            handler(cur) {
                if (this.display) {
                    this.renderHtml();
                } else {
                    if (!utils.diff.same(cur, this.result)) {
                        this.editor.txt.setJSON(cur);
                    }
                }
            }
        }
    }
};
</script>

<style lang="less">
.ivu-form-item-error {
    .w-e-text-container {
        border: 1px solid #ed4014 !important;
    }
}

.editor {
    .preview,
    .w-e-text {
        width: 100%;
        overflow-x: auto;
        color: #323333 !important;
        line-height: 1.5;
        font-size: 14px;

        table {
            width: 100%;
            border-spacing: 0;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            border-collapse: collapse;
            text-align: left;

            td,
            th {
                border: 1px solid #e8eaec !important;

                &:first-child::after {
                    content: '';
                    display: inline-block;
                    vertical-align: top;
                    min-height: 28px;
                }
            }

            th {
                background-color: #f5f5f5 !important;
            }
        }

        /* blockquote 样式 */
        blockquote {
            display: block;
            border-left: 8px solid #d0e5f2;
            padding: 5px 10px;
            margin: 10px 0;
            line-height: 1.5;
            font-size: 100%;
            background-color: #f2f2f2 !important;
        }

        hr {
            border-top: 1px solid #e8eaec !important;
            margin: 20px 0;
        }

        /* ul ol 样式 */
        ul,
        ol {
            margin: 10px 0 10px 20px;
        }
    }
}
</style>
