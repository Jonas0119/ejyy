/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, DATA_MODEL_REMOVE_FAIL } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestParams {
    id: number;
}

const PcContractCategoryDeleteAction = <Action>{
    router: {
        path: '/contract/category_delete/:id',
        method: 'get',
        authRequired: true,
        roles: [ROLE.HTGL]
    },
    validator: {
        params: [
            {
                name: 'id',
                required: true,
                regex: /^\d+$/
            }
        ]
    },
    response: async ctx => {
        const { id } = <RequestParams>ctx.params;

        const used = await ctx.model
            .from('ejyy_contract')
            .where('category_id', id)
            .first();

        if (used) {
            return (ctx.body = {
                code: DATA_MODEL_REMOVE_FAIL,
                message: '合同类别使用中，无法删除'
            });
        }

        await ctx.model
            .from('ejyy_contract_category')
            .where('id', id)
            .delete();

        ctx.body = {
            code: SUCCESS,
            message: '删除合同类别成功'
        };
    }
};

export default PcContractCategoryDeleteAction;
