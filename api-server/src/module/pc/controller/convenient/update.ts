/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, DATA_MODEL_UPDATE_FAIL } from '~/constant/code';

interface RequestBody {
    community_id: number;
    id: number;
    title: string;
    location: string;
    phone: string;
}

const PcConvenientUpdateAction = <Action>{
    router: {
        path: '/convenient/update',
        method: 'post',
        authRequired: true,
        roles: []
    },
    validator: {
        body: [
            {
                name: 'community_id',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'id',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'title',
                required: true,
                max: 30
            },
            {
                name: 'location',
                required: true,
                max: 128
            },
            {
                name: 'phone',
                required: true,
                regex: /^\d{11}$/
            }
        ]
    },
    response: async ctx => {
        const { community_id, id, title, location, phone } = <RequestBody>ctx.request.body;

        const affect = await ctx.model
            .from('ejyy_convenient')
            .update({
                title,
                location,
                phone
            })
            .where({
                community_id,
                id
            });

        if (affect !== 1) {
            return (ctx.body = {
                code: DATA_MODEL_UPDATE_FAIL,
                message: '更新便民信息失败'
            });
        }

        ctx.body = {
            code: SUCCESS,
            message: '更新便民信息成功'
        };
    }
};

export default PcConvenientUpdateAction;
