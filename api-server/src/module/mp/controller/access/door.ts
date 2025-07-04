/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, REMOTE_OPEN_DOOR_FAIL } from '~/constant/code';
import * as accessService from '~/service/access';

interface RequestBody {
    id: number;
    community_id: number;
}

const MpAccessDoorAction = <Action>{
    router: {
        path: '/access/door',
        method: 'post',
        authRequired: true,
        verifyIntact: true
    },
    validator: {
        body: [
            {
                name: 'id',
                required: true
            },
            {
                name: 'community_id',
                required: true
            }
        ]
    },
    response: async ctx => {
        const { id, community_id } = <RequestBody>ctx.request.body;

        const res = await accessService.remoteOpen(id, community_id);

        await ctx.model.from('ejyy_community_remote_open_door_log').insert({
            wechat_mp_user_id: ctx.mpUserInfo.id,
            community_id,
            door_id: id,
            success: res.success ? 1 : 0,
            created_at: Date.now()
        });

        ctx.body = {
            code: res.success ? SUCCESS : REMOTE_OPEN_DOOR_FAIL,
            message: res.message
        };
    }
};

export default MpAccessDoorAction;
