/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, STATUS_ERROR, DATA_MODEL_UPDATE_FAIL } from '~/constant/code';
import { PROPERTY_COMPANY_ALLOW_STEP, USER_FINISH_FITMENT_STEP } from '~/constant/fitment';

interface RequestParams {
    id: number;
}

const MpFitmentFinishAction = <Action>{
    router: {
        path: '/fitment/finish/:id',
        method: 'get',
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
        ]
    },
    response: async ctx => {
        const { id } = <RequestParams>ctx.params;

        const detail = await ctx.model
            .from('ejyy_fitment')
            .where('id', id)
            .where('wechat_mp_user_id', ctx.mpUserInfo.id)
            .select('step')
            .first();

        if (!detail || detail.step !== PROPERTY_COMPANY_ALLOW_STEP) {
            return (ctx.body = {
                code: STATUS_ERROR,
                message: '装修报备状态错误'
            });
        }

        const stamp = Date.now();

        const affect = await ctx.model
            .from('ejyy_fitment')
            .update({
                finished_at: stamp,
                step: USER_FINISH_FITMENT_STEP
            })
            .where('wechat_mp_user_id', ctx.mpUserInfo.id)
            .where('id', id);

        if (affect !== 1) {
            return (ctx.body = {
                code: DATA_MODEL_UPDATE_FAIL,
                message: '装修完工报备失败'
            });
        }

        ctx.body = {
            code: SUCCESS,
            message: '装修完工报备成功',
            data: {
                stamp
            }
        };
    }
};

export default MpFitmentFinishAction;
