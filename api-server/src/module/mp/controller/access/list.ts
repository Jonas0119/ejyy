/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import utils from '~/utils';
import { BINDING_BUILDING } from '~/constant/status';
import { SELF_ACCESS_CODE } from '~/constant/enter_access';

interface RequestBody {
    building_ids: number[];
    community_id: number;
}

const MpAccessListAction = <Action>{
    router: {
        path: '/access/list',
        method: 'post',
        authRequired: true,
        verifyIntact: true
    },
    validator: {
        body: [
            {
                name: 'building_ids',
                required: true,
                validator: val => {
                    return Array.isArray(val) && val.every(item => /^\d+$/.test(item));
                }
            },
            {
                name: 'community_id',
                required: true
            }
        ]
    },
    response: async ctx => {
        const { building_ids, community_id } = <RequestBody>ctx.request.body;

        const buildings = await ctx.model
            .from('ejyy_user_building')
            .leftJoin('ejyy_building_info', 'ejyy_building_info.id', 'ejyy_user_building.building_id')
            .where('ejyy_building_info.community_id', community_id)
            .whereIn('ejyy_user_building.building_id', building_ids)
            .andWhere('ejyy_user_building.wechat_mp_user_id', ctx.mpUserInfo.id)
            .andWhere('ejyy_user_building.status', BINDING_BUILDING)
            .select('ejyy_user_building.building_id')
            .orderBy('ejyy_user_building.id', 'desc');

        const cardList = [];

        buildings.forEach(({ building_id }) => {
            cardList.push({
                building_id,
                uid: utils.access.encrypt(ctx.mpUserInfo.id, building_id, SELF_ACCESS_CODE)
            });
        });

        const entranceList = await ctx.model
            .from('ejyy_iot_entrance')
            .where('community_id', community_id)
            .select('id', 'name')
            .orderBy('id', 'desc');

        ctx.body = {
            code: SUCCESS,
            data: {
                cardList,
                entranceList
            }
        };
    }
};

export default MpAccessListAction;
