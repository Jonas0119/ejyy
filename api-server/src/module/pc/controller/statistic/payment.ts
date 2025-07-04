/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';
import { TRUE } from '~/constant/status';
import moment from 'moment';

interface RequestBody {
    community_id: number;
    start_date: number;
    end_date: number;
}

const StatisticPaymentAction = <Action>{
    router: {
        path: '/statistic/payment',
        method: 'post',
        authRequired: true,
        verifyCommunity: true,
        roles: [ROLE.ANYONE]
    },
    validator: {
        body: [
            {
                name: 'community_id',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'start_date',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'end_date',
                regex: /^\d+$/,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { community_id, start_date, end_date } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_property_fee_order')
            .leftJoin('ejyy_property_fee', 'ejyy_property_fee.id', 'ejyy_property_fee_order.property_fee_id')
            .where('ejyy_property_fee.community_id', community_id)
            .andWhere(
                'ejyy_property_fee_order.created_at',
                '>=',
                moment(start_date)
                    .startOf('day')
                    .valueOf()
            )
            .andWhere(
                'ejyy_property_fee_order.created_at',
                '<=',
                moment(end_date)
                    .startOf('day')
                    .valueOf()
            )
            .andWhere('ejyy_property_fee_order.paid', TRUE)
            .select(
                'ejyy_property_fee.start_year',
                'ejyy_property_fee.end_year',
                'ejyy_property_fee_order.paid',
                'ejyy_property_fee_order.fee',
                'ejyy_property_fee_order.paid_fee',
                'ejyy_property_fee_order.created_at'
            );

        ctx.body = {
            code: SUCCESS,
            data: {
                list
            }
        };
    }
};

export default StatisticPaymentAction;
