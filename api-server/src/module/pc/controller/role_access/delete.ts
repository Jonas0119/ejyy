/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, DATA_MODEL_REMOVE_FAIL } from '~/constant/code';

interface RequestParams {
    id: number;
}

const PcRoleAccessDeleteAction = <Action>{
    router: {
        path: '/role_access/delete/:id',
        method: 'get',
        authRequired: true,
        roles: []
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
            .from('ejyy_property_company_user')
            .where('access_id', id)
            .first();

        if (used) {
            return (ctx.body = {
                code: DATA_MODEL_REMOVE_FAIL,
                message: '权限使用中，无法删除'
            });
        }

        await ctx.model
            .from('ejyy_property_company_access')
            .where('id', id)
            .delete();

        ctx.body = {
            code: SUCCESS,
            message: '删除权限成功'
        };
    }
};

export default PcRoleAccessDeleteAction;
