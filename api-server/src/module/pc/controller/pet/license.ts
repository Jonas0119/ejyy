/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, DATA_MODEL_UPDATE_FAIL } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestParams {
    id: number;
}
interface RequestBody {
    pet_license: string;
    pet_license_award_at: number;
    community_id: number;
}

const PcPetLicenseAction = <Action>{
    router: {
        path: '/pet/license/:id',
        method: 'post',
        authRequired: true,
        roles: [ROLE.CWDA],
        verifyCommunity: true
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
                name: 'pet_license',
                required: true,
                max: 40
            },
            {
                name: 'pet_license_award_at',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'community_id',
                required: true,
                regex: /^\d+$/
            }
        ]
    },
    response: async ctx => {
        const { id } = <RequestParams>ctx.params;
        const { pet_license, pet_license_award_at, community_id } = <RequestBody>ctx.request.body;

        const affect = await ctx.model
            .from('ejyy_pet')
            .update({ pet_license, pet_license_award_at })
            .where('id', id)
            .where('community_id', community_id);

        if (affect !== 1) {
            return (ctx.body = {
                code: DATA_MODEL_UPDATE_FAIL,
                message: '更新宠物登记证件失败'
            });
        }

        ctx.body = {
            code: SUCCESS,
            message: '更新宠物登记证件成功'
        };
    }
};

export default PcPetLicenseAction;
