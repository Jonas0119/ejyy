/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, DATA_MODEL_UPDATE_FAIL } from '~/constant/code';
import {
    REMOVE_PET_BECAUSE_DIE,
    REMOVE_PET_BECAUSE_LOSE,
    REMOVE_PET_BECAUSE_GIVE,
    REMOVE_PET_BECAUSE_CONFISCATE
} from '~/constant/pet';
import { TRUE } from '~/constant/status';

interface RequestParams {
    id: number;
}
interface RequestBody {
    reason:
        | typeof REMOVE_PET_BECAUSE_DIE
        | typeof REMOVE_PET_BECAUSE_LOSE
        | typeof REMOVE_PET_BECAUSE_GIVE
        | typeof REMOVE_PET_BECAUSE_CONFISCATE;
}

const MpPetRemoveAction = <Action>{
    router: {
        path: '/pet/remove/:id',
        method: 'post',
        authRequired: true,
        verifyIntact: true
    },
    validator: {
        params: [
            {
                name: 'id',
                required: true,
                regex: /^\d+$/
            }
        ],
        body: [
            {
                name: 'reason',
                required: true,
                validator: val =>
                    [
                        REMOVE_PET_BECAUSE_DIE,
                        REMOVE_PET_BECAUSE_LOSE,
                        REMOVE_PET_BECAUSE_GIVE,
                        REMOVE_PET_BECAUSE_CONFISCATE
                    ].includes(val)
            }
        ]
    },
    response: async ctx => {
        const { id } = <RequestParams>ctx.params;
        const { reason } = <RequestBody>ctx.request.body;

        const affect = await ctx.model
            .from('ejyy_pet')
            .update({
                remove_reason: reason,
                remove: TRUE,
                removed_at: Date.now()
            })
            .where('id', id)
            .where('wechat_mp_user_id', ctx.mpUserInfo.id);

        if (affect !== 1) {
            return (ctx.body = {
                code: DATA_MODEL_UPDATE_FAIL,
                message: '注销宠物失败'
            });
        }

        ctx.body = {
            code: SUCCESS,
            message: '注销宠物成功'
        };
    }
};

export default MpPetRemoveAction;
