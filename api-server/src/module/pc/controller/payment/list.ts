/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    page_num: number;
    page_size: number;
    community_id: number;
}

const PcPaymentListAction = <Action>{
    router: {
        path: '/payment/list',
        method: 'post',
        authRequired: true,
        verifyCommunity: true,
        roles: [ROLE.CWGL]
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
                name: 'community_id',
                regex: /^\d+$/,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { page_num, page_size, community_id } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_property_fee')
            .leftJoin('ejyy_property_company_user', 'ejyy_property_company_user.id', 'ejyy_property_fee.created_by')
            .where('ejyy_property_fee.community_id', community_id)
            .select(ctx.model.raw('SQL_CALC_FOUND_ROWS ejyy_property_fee.id'))
            .select(
                'ejyy_property_fee.id',
                'ejyy_property_fee.start_year',
                'ejyy_property_fee.end_year',
                'ejyy_property_fee.created_at',
                'ejyy_property_fee.created_by',
                'ejyy_property_company_user.real_name'
            )
            .limit(page_size)
            .offset((page_num - 1) * page_size)
            .orderBy('ejyy_property_fee.id', 'desc');

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

export default PcPaymentListAction;
