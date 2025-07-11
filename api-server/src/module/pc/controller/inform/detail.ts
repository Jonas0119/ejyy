/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, QUERY_ILLEFAL } from '~/constant/code';
import * as ROLE from '~/constant/role_access';

interface RequestParams {
    id: number;
}

const PcInformDetailAction = <Action>{
    router: {
        path: '/inform/detail/:id',
        method: 'get',
        authRequired: true,
        roles: [ROLE.ANYONE]
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
            .from('ejyy_inform')
            .leftJoin('ejyy_property_company_user', 'ejyy_property_company_user.id', 'ejyy_inform.created_by')
            .leftJoin('ejyy_community_info', 'ejyy_community_info.id', 'ejyy_inform.community_id')
            .where('ejyy_inform.id', id)
            .select(
                'ejyy_inform.id',
                'ejyy_inform.title',
                'ejyy_inform.cover_img',
                'ejyy_inform.carousel',
                'ejyy_inform.content',
                'ejyy_inform.created_at',
                'ejyy_inform.published',
                'ejyy_inform.published_at',
                'ejyy_inform.created_by',
                'ejyy_inform.published_by',
                'ejyy_property_company_user.real_name',
                'ejyy_community_info.name as community_name'
            )
            .first();

        if (!detail) {
            return (ctx.body = {
                code: QUERY_ILLEFAL,
                message: '不存在的行政通知'
            });
        }

        let published_real_name = null;

        if (detail.published_by) {
            const pInfo = await ctx.model
                .from('ejyy_property_company_user')
                .where('id', detail.published_by)
                .first();

            published_real_name = pInfo.real_name;
        }

        ctx.body = {
            code: SUCCESS,
            data: {
                ...detail,
                published_real_name
            }
        };
    }
};

export default PcInformDetailAction;
