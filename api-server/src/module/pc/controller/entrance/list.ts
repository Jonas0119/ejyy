/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    community_id: number;
    page_num: number;
    page_size: number;
}

const PcEntranceListAction = <Action>{
    router: {
        path: '/entrance/list',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ZNMJ],
        verifyCommunity: true
    },
    validator: {
        body: [
            {
                name: 'community_id',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'page_num',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'page_size',
                regex: /^\d+$/,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { page_num, page_size, community_id } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_iot_entrance')
            .leftJoin('ejyy_property_company_user', 'ejyy_property_company_user.id', 'ejyy_iot_entrance.created_by')
            .where('ejyy_iot_entrance.community_id', community_id)
            .select(ctx.model.raw('SQL_CALC_FOUND_ROWS ejyy_iot_entrance.id'))
            .select(
                'ejyy_iot_entrance.id',
                'ejyy_iot_entrance.community_id',
                'ejyy_iot_entrance.sign',
                'ejyy_iot_entrance.secret',
                'ejyy_iot_entrance.name',
                'ejyy_iot_entrance.building',
                'ejyy_iot_entrance.category',
                'ejyy_iot_entrance.lng',
                'ejyy_iot_entrance.lat',
                'ejyy_iot_entrance.online',
                'ejyy_iot_entrance.created_by',
                'ejyy_iot_entrance.created_at',
                'ejyy_property_company_user.real_name'
            )
            .limit(page_size)
            .offset((page_num - 1) * page_size)
            .orderBy('ejyy_iot_entrance.id', 'desc');

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

export default PcEntranceListAction;
