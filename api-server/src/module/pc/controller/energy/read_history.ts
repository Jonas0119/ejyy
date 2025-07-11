/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    meter_id: number;
    page_num: number;
    page_size: number;
}

const PcEnergyReadHistoryAction = <Action>{
    router: {
        path: '/energy/read_history',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ANYONE]
    },
    validator: {
        body: [
            {
                name: 'meter_id',
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
        const { page_num, page_size, meter_id } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_iot_meter_read')
            .leftJoin('ejyy_property_company_user', 'ejyy_property_company_user.id', 'ejyy_iot_meter_read.created_by')
            .andWhere('ejyy_iot_meter_read.meter_id', meter_id)
            .select(ctx.model.raw('SQL_CALC_FOUND_ROWS ejyy_iot_meter_read.id'))
            .select(
                'ejyy_iot_meter_read.id',
                'ejyy_iot_meter_read.from_repeater',
                'ejyy_iot_meter_read.last_value',
                'ejyy_iot_meter_read.current_value',
                'ejyy_iot_meter_read.created_by',
                'ejyy_iot_meter_read.created_at',
                'ejyy_property_company_user.real_name'
            )
            .limit(page_size)
            .offset((page_num - 1) * page_size)
            .orderBy('ejyy_iot_meter_read.id', 'desc');

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

export default PcEnergyReadHistoryAction;
