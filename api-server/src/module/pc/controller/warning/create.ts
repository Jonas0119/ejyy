/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, WARNING_NAME_EXIST } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    community_id: number;
    sign: string;
    secret: string;
    name: string;
    lng: number;
    lat: number;
}

const PcWarningCreateAction = <Action>{
    router: {
        path: '/warning/create',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ZHYJ],
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
                name: 'sign',
                max: 32,
                required: true
            },
            {
                name: 'secret',
                max: 128,
                required: true
            },
            {
                name: 'name',
                max: 56,
                required: true
            },
            {
                name: 'lng',
                required: true,
                regex: /^\d+(\.\d+)?$/
            },
            {
                name: 'lat',
                required: true,
                regex: /^\d+(\.\d+)?$/
            }
        ]
    },
    response: async ctx => {
        const { community_id, sign, secret, name, lng, lat } = <RequestBody>ctx.request.body;

        const exist = await ctx.model
            .from('ejyy_iot_warning')
            .where('name', name)
            .andWhere('community_id', community_id)
            .first();

        if (exist) {
            return (ctx.body = {
                code: WARNING_NAME_EXIST,
                message: '中控名称已存在'
            });
        }

        const created_at = Date.now();
        const [id] = await ctx.model.from('ejyy_iot_warning').insert({
            community_id,
            sign,
            secret,
            name,
            lng,
            lat,
            created_by: ctx.pcUserInfo.id,
            created_at
        });

        ctx.body = {
            code: SUCCESS,
            data: {
                id,
                created_at
            }
        };
    }
};

export default PcWarningCreateAction;
