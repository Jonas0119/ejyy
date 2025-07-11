/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, MATERIAL_CATEGORY_EXIST, QUERY_ILLEFAL } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    id: number;
    name: string;
    description?: string;
}

const PcMaterialCategoryUpdateAction = <Action>{
    router: {
        path: '/material/category_update',
        method: 'post',
        authRequired: true,
        roles: [ROLE.WLCC]
    },
    validator: {
        body: [
            {
                name: 'id',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'name',
                max: 56,
                required: true
            },
            {
                name: 'description',
                max: 128
            }
        ]
    },
    response: async ctx => {
        const { id, name, description } = <RequestBody>ctx.request.body;

        const exist = await ctx.model
            .from('ejyy_material_category')
            .where('name', name)
            .first();

        if (!exist) {
            return (ctx.body = {
                code: QUERY_ILLEFAL,
                message: '非法操作'
            });
        }

        const repeat = await ctx.model
            .from('ejyy_material_category')
            .where('name', name)
            .andWhereNot('id', id)
            .first();

        if (repeat) {
            return (ctx.body = {
                code: MATERIAL_CATEGORY_EXIST,
                message: '分类已经存在'
            });
        }

        await ctx.model
            .from('ejyy_material_category')
            .update({
                name,
                description: description ? description : null
            })
            .where('id', id);

        ctx.body = {
            code: SUCCESS
        };
    }
};

export default PcMaterialCategoryUpdateAction;
