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

const PcDepartmentDeleteAction = <Action>{
    router: {
        path: '/department/delete/:id',
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
            .where('department_id', id)
            .first();

        if (used) {
            return (ctx.body = {
                code: DATA_MODEL_REMOVE_FAIL,
                message: '部门信息使用中，无法删除'
            });
        }

        await ctx.model
            .from('ejyy_property_company_department')
            .where('id', id)
            .delete();

        await ctx.model
            .from('ejyy_property_company_job')
            .where('parent_id', id)
            .delete();

        ctx.body = {
            code: SUCCESS,
            message: '删除部门信息成功'
        };
    }
};

export default PcDepartmentDeleteAction;
