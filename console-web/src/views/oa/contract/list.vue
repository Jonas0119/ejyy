/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <WaterMark>
        <Header />

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
import { Header, ListFooter, WaterMark } from '@/components';
import { Card, Page, Spin, Table } from 'view-design';
import pageMixin from '@/mixins/page';
import * as utils from '@/utils';
import moment from 'moment';

export default {
    name: 'OaContractList',
    data() {
        return {
            fetching: true,
            columns: [
                {
                    title: '合同编号',
                    minWidth: 160,
                    render: (h, p) => h('span', utils.order.num('CN', p.row.created_at, p.row.id))
                },
                {
                    title: '合同名称',
                    minWidth: 160,
                    key: 'title'
                },
                {
                    title: '合同类别',
                    minWidth: 120,
                    key: 'category'
                },
                {
                    title: '合同开始时间',
                    minWidth: 120,
                    render: (h, p) => h('span', moment(p.row.begin_time).format('YYYY-MM-DD'))
                },
                {
                    title: '合同结束时间',
                    minWidth: 120,
                    render: (h, p) => h('span', moment(p.row.finish_time).format('YYYY-MM-DD'))
                },
                {
                    title: '创建时间',
                    minWidth: 180,
                    render: (h, p) => h('span', moment(p.row.created_at).format('YYYY-MM-DD HH:mm:ss'))
                },
                {
                    title: '操作',
                    minWidth: 220,
                    fixed: 'right',
                    render: (h, p) =>
                        h('span', [
                            h('a', { on: { click: () => this.goDetail(p.row.id) } }, '查看'),
                            p.row.finish_time + 7000 * 24 * 60 * 60 > Date.now() &&
                            this.userInfo.id === p.row.created_by
                                ? h('a', { on: { click: () => this.goUpdate(p.row.id) } }, '修改合同')
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
            const { page_num, page_size, postInfo } = this;

            this.fetching = true;
            const data = {
                page_num,
                page_size,
                community_id: postInfo.default_community_id
            };

            utils.request
                .post('/contract/list', data)
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
            this.$router.push(`/oa/contract/detail/${id}`);
        },
        goUpdate(id) {
            this.$router.push(`/oa/contract/update/${id}`);
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
        WaterMark
    }
};
</script>
