/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, MODEL_FIELD_VALUE_EXIST } from '~/constant/code';

interface RequestBody {
    name: string;
}

const PcDepartmentCreateAction = <Action>{
    router: {
        path: '/department/create',
        method: 'post',
        authRequired: true,
        roles: []
    },
    validator: {
        body: [
            {
                name: 'name',
                required: true,
                max: 12
            }
        ]
    },
    response: async ctx => {
        const { name } = <RequestBody>ctx.request.body;

        const exist = await ctx.model
            .from('ejyy_property_company_department')
            .where('name', name)
            .first();

        if (exist) {
            return (ctx.body = {
                code: MODEL_FIELD_VALUE_EXIST,
                message: '部门名称已存在'
            });
        }

        const [id] = await ctx.model.from('ejyy_property_company_department').insert({
            name
        });

        ctx.body = {
            code: SUCCESS,
            data: {
                id
            }
        };
    }
};

export default PcDepartmentCreateAction;
