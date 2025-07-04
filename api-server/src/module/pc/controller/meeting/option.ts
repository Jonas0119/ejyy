/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';
import moment from 'moment';
import { FALSE } from '~/constant/status';

interface RequestBody {
    community_id: number;
}

const PcMeetingOptionAction = <Action>{
    router: {
        path: '/meeting/option',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ANYONE],
        verifyCommunity: true
    },
    validator: {
        body: [
            {
                name: 'community_id',
                regex: /^\d+$/,
                required: true
            }
        ]
    },
    response: async ctx => {
        const { community_id } = <RequestBody>ctx.request.body;

        const list = await ctx.model
            .from('ejyy_meeting_room')
            .where('community_id', community_id)
            .select('id', 'name', 'local', 'have_tv', 'have_board', 'have_projector');

        const start = moment()
            .startOf('day')
            .valueOf();
        const end = moment()
            .add(6, 'day')
            .endOf('day')
            .valueOf();

        const using = await ctx.model
            .from('ejyy_meeting')
            .where('community_id', community_id)
            .andWhere('start_time', '>=', start)
            .andWhere('end_time', '<=', end)
            .andWhere('cancel', FALSE)
            .select('meeting_room_id', 'start_time', 'end_time');

        ctx.body = {
            code: SUCCESS,
            data: {
                list,
                using
            }
        };
    }
};

export default PcMeetingOptionAction;
