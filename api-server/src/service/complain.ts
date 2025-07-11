/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import Knex from 'knex';
import * as redisService from './redis';
import * as ROLE from '~/constant/role_access';

export async function noticePropertyCompany(model: Knex, id: number) {
    const { community_id } = await model
        .from('ejyy_community_info')
        .leftJoin('ejyy_complain', 'ejyy_complain.community_id', 'ejyy_community_info.id')
        .where('ejyy_complain.id', id)
        .select('ejyy_community_info.id as community_id')
        .first();

    redisService.pubish(redisService.WS_NOTICE_TO_PROPERTY_COMPANY, {
        id,
        type: ROLE.TSJY,
        urge: false,
        community_id
    });
}
