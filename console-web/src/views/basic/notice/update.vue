/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <WaterMark>
        <Header back />

        <Editor :onSubmit="submit" update :detail="detail" />

        <Spin size="large" fix v-if="fetching" />
    </WaterMark>
</template>

<script>
import { mapGetters } from 'vuex';
import { Message, Spin } from 'view-design';
import { Header, WaterMark } from '@/components';
import Editor from './components/editor';
import * as utils from '@/utils';

export default {
    name: 'BasicNoticeUpdate',
    components: {
        Header,
        Editor,
        Message,
        Spin,
        WaterMark
    },
    data() {
        return {
            fetching: true,
            detail: {}
        };
    },
    mounted() {
        if (this.postInfo.default_community_id) {
            this.getDetail();
        }
    },
    methods: {
        getDetail() {
            const data = {
                id: this.$route.params.id,
                community_id: this.postInfo.default_community_id
            };

            utils.request
                .post('/notice/detail', data)
                .then(res => {
                    this.fetching = false;
                    this.detail = res.data;
                })
                .catch(() => (this.fetching = false));
        },
        submit(data) {
            return new Promise((resolve, reject) => {
                data.id = this.$route.params.id;
                data.community_id = this.postInfo.default_community_id;

                utils.request
                    .post('/notice/update', data)
                    .then(() => {
                        Message.success('更新小区通知成功');
                        this.$router.push(`/basic/notice/preview/${this.$route.params.id}`);
                        resolve();
                    })
                    .catch(() => reject());
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
            this.getDetail();
        }
    }
};
</script>
