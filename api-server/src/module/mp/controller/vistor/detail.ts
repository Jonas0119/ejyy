/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import { VISTOR_ACCESS_CODE } from '~/constant/enter_access';
import utils from '~/utils';

interface RequestParams {
    id: number;
}

const MpVistorDetailAction = <Action>{
    router: {
        path: '/vistor/detail/:id',
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
            .from('ejyy_vistor')
            .leftJoin('ejyy_community_info', 'ejyy_community_info.id', 'ejyy_vistor.community_id')
            .leftJoin('ejyy_building_info', 'ejyy_building_info.id', 'ejyy_vistor.building_id')
            .select(
                'ejyy_vistor.id',
                'ejyy_vistor.vistor_name',
                'ejyy_vistor.vistor_phone',
                'ejyy_vistor.car_number',
                'ejyy_vistor.uid',
                'ejyy_vistor.have_vistor_info',
                'ejyy_vistor.expire',
                'ejyy_vistor.used_at',
                'ejyy_vistor.created_at',
                'ejyy_vistor.building_id',
                'ejyy_building_info.type',
                'ejyy_building_info.area',
                'ejyy_building_info.building',
                'ejyy_building_info.unit',
                'ejyy_building_info.number',
                'ejyy_community_info.name as community_name'
            )
            .select(ctx.model.raw('IF(ejyy_vistor.property_company_user_id, 1, 0) as check_in'))
            .where('ejyy_vistor.id', id)
            .where('ejyy_vistor.wechat_mp_user_id', ctx.mpUserInfo.id)
            .first();

        detail.vistor_phone = utils.phone.hide(detail.vistor_phone);

        const uid = utils.access.encrypt(detail.id, detail.building_id, VISTOR_ACCESS_CODE);

        ctx.body = {
            code: SUCCESS,
            data: {
                ...detail,
                uid
            }
        };
    }
};

export default MpVistorDetailAction;
