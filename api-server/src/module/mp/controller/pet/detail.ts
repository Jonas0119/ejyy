/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';

interface RequestParams {
    id: number;
}

const MpPetDetailAction = <Action>{
    router: {
        path: '/pet/detail/:id',
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

        const info = await ctx.model
            .from('ejyy_pet')
            .leftJoin('ejyy_community_info', 'ejyy_community_info.id', 'ejyy_pet.community_id')
            .select(
                'ejyy_pet.id',
                'ejyy_pet.name',
                'ejyy_pet.sex',
                'ejyy_pet.pet_type',
                'ejyy_pet.coat_color',
                'ejyy_pet.breed',
                'ejyy_pet.photo',
                'ejyy_pet.pet_license',
                'ejyy_pet.pet_license_award_at',
                'ejyy_community_info.name as community_name'
            )
            .where('ejyy_pet.id', id)
            .where('wechat_mp_user_id', ctx.mpUserInfo.id)
            .first();

        const vaccinates = await ctx.model
            .from('ejyy_pet_vaccinate')
            .select('vaccinated_at', 'vaccine_type')
            .where('pet_id', id)
            .orderBy('id', 'desc');

        ctx.body = {
            code: SUCCESS,
            data: {
                info,
                vaccinates
            }
        };
    }
};

export default MpPetDetailAction;
