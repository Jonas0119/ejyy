/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <section>
        <Header />

        <Editor :onSubmit="submit" update :detail="detail" />

        <Spin size="large" fix v-if="fetching" />
    </section>
</template>

<script>
import { mapGetters } from 'vuex';
import { Message, Spin } from 'view-design';
import { Header } from '@/components';
import Editor from './components/editor';
import * as utils from '@/utils';

export default {
    name: 'BasicQuestionnaireUpdate',
    components: {
        Header,
        Editor,
        Message,
        Spin
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
                .post('/questionnaire/detail', data)
                .then(res => {
                    this.fetching = false;
                    this.detail = {
                        title: res.data.info.title,
                        expire: res.data.info.expire,
                        published: res.data.info.published,
                        questions: res.data.questions.map(item => {
                            return {
                                title: item.title,
                                type: item.type,
                                options: item.options.map(record => record.option_val)
                            };
                        })
                    };
                })
                .catch(() => (this.fetching = false));
        },
        submit(data) {
            return new Promise((resolve, reject) => {
                data.id = this.$route.params.id;
                data.community_id = this.postInfo.default_community_id;

                utils.request
                    .post('/questionnaire/update', data)
                    .then(() => {
                        Message.success('问卷修改成功');
                        this.$router.push(`/basic/questionnaire/preview/${this.$route.params.id}`);
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
