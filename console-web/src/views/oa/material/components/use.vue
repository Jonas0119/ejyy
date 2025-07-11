/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <Drawer
        :value="value"
        :title="`物料「${info.name}」领用`"
        transfer
        width="460"
        class-name="cw-drawer-width-footer"
        :closable="false"
        :mask-closable="false"
    >
        <Form :model="form" :rules="rules" ref="form" @submit.native.prevent label-position="top">
            <FormItem prop="used_by" label="领用人：">
                <Colleague v-model="form.used_by" />
            </FormItem>
            <FormItem prop="total" label="领用数量：">
                <Input v-model="form.total" type="number" placeholder="请输入领用数量" />
            </FormItem>
            <FormItem prop="reason" label="领用用途：">
                <Input
                    v-model="form.reason"
                    type="textarea"
                    :row="3"
                    show-word-limit
                    :maxlength="128"
                    placeholder="请输入领用用途"
                />
            </FormItem>
        </Form>
        <div class="cw-drawer-footer">
            <Button @click="cancel">取消</Button>
            <Button type="primary" :loading="submiting" @click="save">确定</Button>
        </div>
    </Drawer>
</template>

<script>
import { mapGetters } from 'vuex';
import { Drawer, Form, Input, FormItem, Button, Message } from 'view-design';
import { Colleague } from '@/components';
import * as utils from '@/utils';

export default {
    name: 'OaMaterialUse',
    props: {
        value: Boolean,
        info: Object
    },
    data() {
        return {
            submiting: false,
            form: {
                used_by: undefined,
                total: '',
                reason: ''
            },
            rules: {
                used_by: [{ required: true, type: 'number', message: '请选择领用人' }],
                total: [
                    { required: true, message: '请输入领用数量' },
                    { pattern: /^\d+$/, message: '领用数量仅支持整数' },
                    {
                        message: '领用数量应小于库存数量',
                        validator: (rule, val, cb) => {
                            if (val && this.info.total < val) {
                                cb(new Error('领用数量应小于库存数量'));
                            } else {
                                cb();
                            }
                        }
                    }
                ],
                reason: [
                    { required: true, message: '请输入领用用途' },
                    { max: 128, message: '领用用途最多输入128个字符' }
                ]
            }
        };
    },
    methods: {
        cancel() {
            this.$emit('input', false);

            this.form = {
                used_by: undefined,
                total: '',
                reason: ''
            };
            this.$refs.form.resetFields();
        },
        save() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return;
                }

                this.submiting = true;

                const data = {
                    id: this.info.id,
                    community_id: this.postInfo.default_community_id,
                    ...this.form,
                    total: parseInt(this.form.total, 10)
                };

                utils.request
                    .post('/material/use', data)
                    .then(() => {
                        this.$emit('update:info', {
                            ...this.info,
                            total: this.info.total - data.total
                        });
                        this.submiting = false;
                        Message.success('物品领用成功');
                        this.cancel();
                    })
                    .catch(() => (this.submiting = false));
            });
        }
    },
    computed: {
        ...mapGetters({
            postInfo: 'common/postInfo'
        })
    },
    components: {
        Drawer,
        Form,
        Input,
        FormItem,
        Colleague,
        Button
    }
};
</script>
