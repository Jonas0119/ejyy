/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, STOREHOUSE_EXIST } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestBody {
    community_id: number;
    name: string;
    local: string;
}

const PcStorehouseCreateAction = <Action>{
    router: {
        path: '/storehouse/create',
        method: 'post',
        authRequired: true,
        roles: [ROLE.WLCC],
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
                name: 'name',
                max: 12,
                required: true
            },
            {
                name: 'local',
                max: 56,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { name, community_id, local } = <RequestBody>ctx.request.body;

        const exist = await ctx.model
            .from('ejyy_storehouse')
            .where('name', name)
            .andWhere('community_id', community_id)
            .first();

        if (exist) {
            return (ctx.body = {
                code: STOREHOUSE_EXIST,
                message: '仓库已存在'
            });
        }

        const created_at = Date.now();
        const [id] = await ctx.model.from('ejyy_storehouse').insert({
            name,
            local,
            community_id,
            created_by: ctx.pcUserInfo.id,
            created_at
        });

        ctx.body = {
            code: SUCCESS,
            data: {
                created_at,
                id
            }
        };
    }
};

export default PcStorehouseCreateAction;
