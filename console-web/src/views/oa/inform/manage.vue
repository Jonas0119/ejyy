/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <WaterMark>
        <Header />

        <FilterQuery :filterOptions="filterOptions" :filters="filters" class="mt-16" />

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

        <Spin size="large" fix v-if="fetching" />
    </WaterMark>
</template>

<script>
import { mapGetters } from 'vuex';
import { Header, ListFooter, FilterQuery, WaterMark } from '@/components';
import { Card, Page, Spin, Table, Tag, Modal, Message } from 'view-design';
import pageMixin from '@/mixins/page';
import * as utils from '@/utils';
import moment from 'moment';

export default {
    name: 'OaInformManage',
    data() {
        return {
            fetching: true,
            filterOptions: [
                {
                    label: '发布状态',
                    prop: 'published',
                    list: [
                        { label: '已发布', value: 1 },
                        { label: '未发布', value: 0 }
                    ]
                },
                {
                    label: '推送首页',
                    prop: 'carousel',
                    list: [
                        { label: '是', value: 1 },
                        { label: '否', value: 0 }
                    ]
                }
            ],
            filters: {
                published: undefined
            },
            columns: [
                {
                    title: '文章编号',
                    minWidth: 140,
                    render: (h, p) => h('span', utils.order.num('IA', p.row.created_at, p.row.id))
                },
                {
                    title: '标题',
                    minWidth: 120,
                    key: 'title'
                },
                {
                    title: '推送首页',
                    minWidth: 80,
                    render: (h, p) =>
                        h(
                            Tag,
                            { props: { color: p.row.carousel ? 'success' : 'default' } },
                            p.row.carousel ? '是' : '否'
                        )
                },
                {
                    title: '发布状态',
                    minWidth: 80,
                    render: (h, p) => {
                        const color = !p.row.published ? 'default' : 'green';

                        return h(Tag, { props: { color } }, !p.row.published ? '未发布' : '已发布');
                    }
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
                    title: '创建时间',
                    key: 'created_at',
                    minWidth: 180,
                    render: (h, p) => h('span', moment(p.row.created_at).format('YYYY-MM-DD HH:mm:ss'))
                },
                {
                    title: '发布时间',
                    minWidth: 180,
                    render: (h, p) =>
                        h('span', p.row.published ? moment(p.row.published_at).format('YYYY-MM-DD HH:mm:ss') : '-')
                },
                {
                    title: '操作',
                    key: 'id',
                    minWidth: 180,
                    fixed: 'right',
                    render: (h, p) =>
                        h('span', [
                            h('a', { on: { click: () => this.goDetail(p.row.id) } }, '查看'),
                            !p.row.published ? h('a', { on: { click: () => this.goUpdate(p.row.id) } }, '修改') : '',
                            !p.row.published
                                ? h('a', { on: { click: () => this.doPublish(p.row, p.index) } }, '发布')
                                : ''
                        ])
                }
            ]
        };
    },
    mixins: [pageMixin],
    mounted() {
        if (this.postInfo.default_community_id) {
            this.getListData();
        }
    },
    methods: {
        getListData() {
            const { page_num, page_size, postInfo, filters } = this;

            this.fetching = true;
            const data = {
                page_num,
                page_size,
                community_id: postInfo.default_community_id,
                ...filters
            };

            utils.request
                .post('/inform/manage', data)
                .then(res => {
                    this.fetching = false;
                    this.page_num = res.data.page_num;
                    this.page_size = res.data.page_size;
                    this.list = res.data.list;
                    this.total = res.data.total;
                })
                .catch(() => (this.fetching = false));
        },
        goDetail(id) {
            this.$router.push(`/oa/inform/detail/${id}`);
        },
        goUpdate(id) {
            this.$router.push(`/oa/inform/update/${id}`);
        },
        doPublish(record, index) {
            Modal.confirm({
                title: '请确认',
                content: `确认要发布「${record.title}」行政通知吗？发布后将不可修改`,
                onOk: () => {
                    const data = {
                        community_id: this.postInfo.default_community_id,
                        id: record.id
                    };

                    utils.request.post('/inform/published', data).then(res => {
                        this.list[index].published = true;
                        this.list[index].published_at = res.data.published_at;
                        Message.success('行政通知发布成功');
                    });
                }
            });
        }
    },
    computed: {
        ...mapGetters({
            postInfo: 'common/postInfo'
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
        FilterQuery,
        WaterMark
    }
};
</script>
