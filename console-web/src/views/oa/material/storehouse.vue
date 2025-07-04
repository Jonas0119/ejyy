/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <WaterMark>
        <Header />

        <Button type="primary" @click="showModal" class="mb-16">添加仓库</Button>

        <Card dis-hover :bordered="false">
            <Table stripe :columns="columns" :data="list" />

            <ListFooter>
                <Page
                    show-total
                    show-elevator
                    show-sizer
                    :page-size="page_size"
                    :total="total"
                    :current="page_num"
                    @on-change="onPageChange"
                    @on-page-size-change="onPageSizeChange"
                />
            </ListFooter>
        </Card>

        <Modal :title="editId ? '修改仓库' : '添加仓库'" v-model="visible">
            <Form :model="form" :rules="rules" ref="form" @submit.native.prevent>
                <FormItem prop="name" label="仓库名称：">
                    <Input v-model="form.name" placeholder="请输入仓库名称" />
                </FormItem>
                <FormItem prop="local" label="仓库位置：">
                    <Input v-model="form.local" placeholder="请输入仓库位置" />
                </FormItem>
            </Form>

            <div slot="footer">
                <Button @click="hideModal">取消</Button>
                <Button type="primary" @click="submit" :loading="submiting">{{ editId ? '更新' : '确认' }}</Button>
            </div>
        </Modal>
        <Spin size="large" fix v-if="fetching" />
    </WaterMark>
</template>

<script>
import { mapGetters } from 'vuex';
import { Header, ListFooter, WaterMark } from '@/components';
import { Card, Page, Spin, Table, Button, Form, FormItem, Modal, Input, Message } from 'view-design';
import * as utils from '@/utils';
import moment from 'moment';
import pageMixin from '@/mixins/page';

export default {
    name: 'OaMaterialStorehouse',
    data() {
        return {
            fetching: true,
            columns: [
                {
                    title: '仓库编号',
                    minWidth: 140,
                    render: (h, p) => h('span', utils.order.num('SH', p.row.created_at, p.row.id))
                },
                {
                    title: '仓库名称',
                    minWidth: 140,
                    key: 'name'
                },
                {
                    title: '仓库位置',
                    minWidth: 240,
                    key: 'local'
                },
                {
                    title: '创建时间',
                    minWidth: 120,
                    render: (h, p) => h('span', moment(p.row.created_at).format('YYYY-MM-DD HH:mm:ss'))
                },
                {
                    title: '创建人',
                    minWidth: 120,
                    render: (h, p) =>
                        h(
                            'a',
                            {
                                on: {
                                    click: () => this.$router.push(`/oa/hr/colleague/detail/${p.row.created_by}`)
                                }
                            },
                            p.row.real_name
                        )
                },
                {
                    title: '操作',
                    key: 'id',
                    minWidth: 140,
                    fixed: 'right',
                    render: (h, p) =>
                        h('span', [
                            h('a', { on: { click: () => this.update(p.row.id, p.index) } }, '修改'),
                            h('a', { on: { click: () => this.delete(p.row.id, p.index) } }, '删除'),
                            h('a', { on: { click: () => this.printCode(p.row) } }, '打印二维码')
                        ])
                }
            ],
            visible: false,
            editId: null,
            editIndex: -1,
            submiting: false,
            form: {
                name: '',
                local: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入仓库名称' },
                    { max: 12, message: '仓库名称不能大于12个字符' }
                ],
                local: [
                    { required: true, message: '请输入仓库位置' },
                    { max: 56, message: '仓库位置不能大于56个字符' }
                ]
            }
        };
    },
    mounted() {
        if (this.postInfo.default_community_id) {
            this.getListData();
        }
    },
    mixins: [pageMixin],
    methods: {
        getListData() {
            const { page_num, page_size } = this;

            this.fetching = true;

            utils.request
                .post('/storehouse/list', { page_num, page_size, community_id: this.postInfo.default_community_id })
                .then(res => {
                    this.fetching = false;
                    this.page_num = res.data.page_num;
                    this.page_size = res.data.page_size;
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
                .catch(() => (this.fetching = false));
        },
        showModal() {
            this.editId = null;
            this.editIndex = -1;
            this.visible = true;
        },
        hideModal() {
            this.visible = false;
        },
        update(id, index) {
            this.editId = id;
            this.editIndex = index;
            this.form.name = this.list[index].name;
            this.form.local = this.list[index].local;
            this.visible = true;
        },
        delete(id, index) {
            Modal.confirm({
                title: '请确认',
                content: `确认要删除「${this.list[index].name}」仓库吗？`,
                onOk: () => {
                    utils.request
                        .post('/storehouse/delete', { id, community_id: this.postInfo.default_community_id })
                        .then(() => {
                            this.list.splice(index, 1);
                            Message.success('删除仓库成功');
                        })
                        .catch(() => {});
                }
            });
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return;
                }

                this.submiting = true;

                const resetFields = () => {
                    this.form.name = '';
                    this.form.local = '';
                    this.$refs.form.resetFields();
                    this.submiting = false;
                    this.visible = false;
                };

                if (this.editId) {
                    utils.request
                        .post('/storehouse/update', {
                            ...this.form,
                            id: this.editId,
                            community_id: this.postInfo.default_community_id
                        })
                        .then(() => {
                            const list = [].concat(this.list);

                            list[this.editIndex] = {
                                ...list[this.editIndex],
                                ...this.form
                            };

                            this.list = list;

                            resetFields();
                            Message.success('修改仓库成功');
                        })
                        .catch(() => (this.submiting = false));
                } else {
                    utils.request
                        .post('/storehouse/create', { ...this.form, community_id: this.postInfo.default_community_id })
                        .then(res => {
                            this.list.unshift({
                                id: res.data.id,
                                ...this.form,
                                created_at: res.data.created_at,
                                created_by: this.userInfo.id,
                                real_name: this.userInfo.real_name
                            });

                            resetFields();
                            Message.success('添加仓库成功');
                        })
                        .catch(() => (this.submiting = false));
                }
            });
        },
        printCode(info) {
            this.$router.push(
                `/print/storehouse?code=${utils.order.num('SH', info.created_at, info.id)}&title=${info.name}`
            );
        }
    },
    computed: {
        ...mapGetters({
            postInfo: 'common/postInfo',
            userInfo: 'common/userInfo'
        })
    },
    watch: {
        'postInfo.default_community_id'() {
            this.getListData();
        }
    },
    components: {
        Header,
        ListFooter,
        Card,
        Page,
        Spin,
        Table,
        Button,
        Form,
        FormItem,
        Modal,
        Input,
        WaterMark
    }
};
</script>
