/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import { DOG, MALE, FEMALE } from '~/constant/pet';

interface RequestBody {
    pet_type: typeof DOG;
    name: string;
    sex: typeof MALE | typeof FEMALE;
    photo: string;
    coat_color: string;
    breed: string;
    haveLicense: boolean;
    pet_license?: string;
    pet_license_award_at?: number;
    vaccinated_at?: number;
    vaccine_type?: string;
    community_id: number;
}

const MpPetCreateAction = <Action>{
    router: {
        path: '/pet/create',
        method: 'post',
        authRequired: true,
        verifyIntact: true
    },
    validator: {
        body: [
            {
                name: 'pet_type',
                required: true,
                regex: /^1$/
            },
            {
                name: 'name',
                required: true,
                max: 12
            },
            {
                name: 'sex',
                required: true,
                regex: /^0|1$/
            },
            {
                name: 'photo',
                required: true,
                max: 128
            },
            {
                name: 'coat_color',
                required: true,
                max: 12
            },
            {
                name: 'breed',
                required: true,
                max: 20
            },
            {
                name: 'haveLicense',
                required: true,
                regex: /^true|false$/
            },
            {
                name: 'pet_license',
                max: 40
            },
            {
                name: 'pet_license_award_at',
                regex: /^\d+$/
            },
            {
                name: 'vaccinated_at',
                regex: /^\d+$/
            },
            {
                name: 'vaccine_type',
                max: 32
            },
            {
                name: 'community_id',
                required: true,
                regex: /^\d+$/
            }
        ]
    },
    response: async ctx => {
        const {
            pet_type,
            name,
            sex,
            photo,
            coat_color,
            breed,
            haveLicense,
            pet_license,
            pet_license_award_at,
            vaccinated_at,
            vaccine_type,
            community_id
        } = <RequestBody>ctx.request.body;

        const [id] = await ctx.model.from('ejyy_pet').insert({
            wechat_mp_user_id: ctx.mpUserInfo.id,
            community_id,
            pet_type,
            name,
            sex,
            photo,
            coat_color,
            breed,
            created_at: Date.now()
        });

        if (haveLicense) {
            await ctx.model
                .from('ejyy_pet')
                .update({
                    pet_license,
                    pet_license_award_at
                })
                .where({ id });

            await ctx.model.from('ejyy_pet_vaccinate').insert({
                pet_id: id,
                vaccinated_at,
                vaccine_type,
                created_at: Date.now()
            });
        }

        ctx.body = {
            code: SUCCESS,
            data: {
                id
            }
        };
    }
};

export default MpPetCreateAction;
