/** * +---------------------------------------------------------------------- * | 开源物业管理系统，敬请使用 *
+---------------------------------------------------------------------- */

<template>
    <FormItem :label="title" :prop="prop">
        <div class="form-field" :style="fieldStyle">
            <slot />
            <div class="form-field-unit" v-if="unit">（{{ unit }}）</div>
        </div>
        <div v-if="label" class="form-field-label">
            {{ label }}
        </div>
    </FormItem>
</template>

<script>
import { FormItem } from 'view-design';
import formMixin from '@/mixins/form';
import { FORM_ADAPT_WIDTH } from '@/config';

export default {
    name: 'FormField',
    props: {
        title: String,
        label: String,
        prop: String,
        unit: String,
        width: String
    },
    mixins: [formMixin],
    components: {
        FormItem
    },
    computed: {
        fieldStyle() {
            if (!this.width || this.winWidth < FORM_ADAPT_WIDTH) {
                return '';
            }

            return {
                width: `${this.width}px`
            };
        }
    }
};
</script>

<style lang="less">
.form-field {
    display: flex;
    flex-direction: row;
    min-height: 36px;
    align-items: center;

    &-unit {
        padding-left: 6px;
        flex: none;
        color: #777;
        padding-right: 6px;
    }

    &-label {
        font-size: 12px;
        color: #999;
        line-height: 20px;
        margin-top: 6px;
    }
}
</style>
