/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import Knex from 'knex';
import * as redisService from './redis';
import * as ROLE from '~/constant/role_access';

async function send(model: Knex, id: number, urge = false) {
    const { community_id } = await model
        .from('ejyy_community_info')
        .leftJoin('ejyy_repair', 'ejyy_repair.community_id', 'ejyy_community_info.id')
        .where('ejyy_repair.id', id)
        .select('ejyy_community_info.id as community_id')
        .first();

    redisService.pubish(redisService.WS_NOTICE_TO_PROPERTY_COMPANY, {
        id,
        type: ROLE.WXWF,
        urge,
        community_id
    });
}

export async function noticePropertyCompany(model: Knex, id: number) {
    send(model, id);
}

// 用户催促工单
export function userUrge(model: Knex, id: number) {
    send(model, id, true);
}
