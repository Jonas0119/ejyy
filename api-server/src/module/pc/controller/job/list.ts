/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';

interface RequestBody {
    page_num: number;
    page_size: number;
    parent_id: number;
}

const PcJobListAction = <Action>{
    router: {
        path: '/job/list',
        method: 'post',
        authRequired: true,
        roles: []
    },
    validator: {
        body: [
            {
                name: 'page_num',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'page_size',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'parent_id',
                regex: /^\d+$/,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { page_num, page_size, parent_id } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_property_company_job')
            .andWhere('parent_id', parent_id)
            .select(ctx.model.raw('SQL_CALC_FOUND_ROWS id'))
            .select('id', 'name')
            .limit(page_size)
            .offset((page_num - 1) * page_size)
            .orderBy('id', 'desc');

        const [res] = await ctx.model.select(ctx.model.raw('found_rows() AS total'));

        ctx.body = {
            code: SUCCESS,
            data: {
                list,
                total: res.total,
                page_amount: Math.ceil(res.total / page_size),
                page_num,
                page_size
            }
        };
    }
};

export default PcJobListAction;
