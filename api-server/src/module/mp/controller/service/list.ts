/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import { TRUE } from '~/constant/status';
import * as mpService from '~/service/map';

interface RequestBody {
    page_num: number;
    page_size: number;
    community_id: number;
    category: string;
    radius: number;
}

const MpServiceListAction = <Action>{
    router: {
        path: '/service/list',
        method: 'post',
        authRequired: true,
        verifyIntact: true
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
            },
            {
                name: 'radius',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'category',
                required: true
            }
        ]
    },
    response: async ctx => {
        const { page_num, page_size, community_id, category, radius } = <RequestBody>ctx.request.body;

        const setting = await ctx.model
            .from('ejyy_employee_sign_setting')
            .where('community_id', community_id)
            .andWhere('latest', TRUE)
            .first();

        const res = await mpService.search({
            boundary: `nearby(${setting ? setting.lat : '43.26624'},${
                setting ? setting.lng : '117.54421'
            },${radius},1)`,
            category,
            page_size,
            page_index: page_num
        });

        ctx.body = {
            code: SUCCESS,
            data: {
                list: res.data,
                total: res.count,
                page_amount: Math.ceil(res.count / page_size),
                page_num,
                page_size
            }
        };
    }
};

export default MpServiceListAction;
