/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, MODEL_FIELD_VALUE_EXIST } from '~/constant/code';

interface RequestBody {
    name: string;
    parent_id: number;
}

const PcJobCreateAction = <Action>{
    router: {
        path: '/job/create',
        method: 'post',
        authRequired: true,
        roles: []
    },
    validator: {
        body: [
            {
                name: 'parent_id',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'name',
                required: true,
                max: 12
            }
        ]
    },
    response: async ctx => {
        const { name, parent_id } = <RequestBody>ctx.request.body;

        const existDeparment = await ctx.model
            .from('ejyy_property_company_department')
            .where('id', parent_id)
            .first();

        if (!existDeparment) {
            return (ctx.body = {
                code: MODEL_FIELD_VALUE_EXIST,
                message: '部门非法'
            });
        }

        const existJob = await ctx.model
            .from('ejyy_property_company_job')
            .where('name', name)
            .first();

        if (existJob) {
            return (ctx.body = {
                code: MODEL_FIELD_VALUE_EXIST,
                message: '岗位已存在'
            });
        }

        const [id] = await ctx.model.from('ejyy_property_company_job').insert({
            parent_id,
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

export default PcJobCreateAction;
