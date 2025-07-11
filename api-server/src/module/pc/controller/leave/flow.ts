/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS, QUERY_ILLEFAL } from '~/constant/code';
import * as ROLE from '~/constant/role_access';
import { WORKFLOW_NODE_NOTICE, WORKFLOW_NODE_APPROVER } from '~/constant/workflow';
import { TRUE, FALSE } from '~/constant/status';
import * as workflowService from '~/service/workflow';
import moment from 'moment';

interface RequestBody {
    id: number;
    node_id: number;
    agree: typeof TRUE | typeof FALSE;
    reason: string;
    community_id: number;
}

const PcLeaveFlowAction = <Action>{
    router: {
        path: '/leave/flow',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ANYONE],
        verifyCommunity: true
    },
    validator: {
        body: [
            {
                name: 'id',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'node_id',
                required: true,
                regex: /^\d+$/
            },
            {
                name: 'agree',
                required: true,
                regex: /^0|1$/
            },
            {
                name: 'reason',
                max: 128
            },
            {
                name: 'community_id',
                required: true,
                regex: /^\d+$/
            }
        ]
    },
    response: async ctx => {
        const { id, node_id, agree, reason, community_id } = <RequestBody>ctx.request.body;

        const flowInfo = await ctx.model
            .from('ejyy_ask_for_leave')
            .where('id', id)
            .andWhere('community_id', community_id)
            .first();

        if (!flowInfo || flowInfo.cancel === TRUE) {
            return (ctx.body = {
                code: QUERY_ILLEFAL,
                message: '非法修改流程'
            });
        }

        const flowNodes = await ctx.model.from('ejyy_ask_for_leave_flow').where('parent_id', id);
        const index = flowNodes.findIndex(step => step.id === node_id);

        if (index < 0 || flowNodes[index].step !== flowInfo.step || flowNodes[index].finish === TRUE) {
            return (ctx.body = {
                code: QUERY_ILLEFAL,
                message: '非法修改流程'
            });
        }

        const finished_at = Date.now();
        await ctx.model
            .from('ejyy_ask_for_leave_flow')
            .where('id', node_id)
            .update({
                finish: TRUE,
                refuse_reason: reason ? reason : null,
                finished_at
            });

        if (agree === FALSE) {
            await ctx.model
                .from('ejyy_ask_for_leave')
                .where('id', id)
                .update({ success: FALSE, step: flowNodes[index].step });

            workflowService.noticeResult(ctx.model, {
                id,
                refer: 'leave',
                success: FALSE,
                reason,
                created_by: flowInfo.created_by,
                time: moment(finished_at).format('YYYY-MM-DD HH:mm:ss'),
                digest: `${moment(flowInfo.begin_date).format('YYYY-MM-DD')}请假${flowInfo.total}天`
            });
        } else {
            for (const node of flowNodes) {
                if (node.step <= flowInfo.step) {
                    continue;
                } else {
                    if (node.node_type === WORKFLOW_NODE_APPROVER) {
                        await ctx.model
                            .from('ejyy_ask_for_leave')
                            .where('id', id)
                            .update({ step: node.step });

                        workflowService.noticeApprover(ctx.model, {
                            id,
                            refer: 'leave',
                            title: '员工请假申请',
                            relation_user_id: node.relation_user_id,
                            created_by: flowInfo.created_by,
                            time: moment(flowInfo.created_at).format('YYYY-MM-DD HH:mm:ss'),
                            digest: `${moment(flowInfo.begin_date).format('YYYY-MM-DD')}请假${flowInfo.total}天`
                        });
                        break;
                    } else if (node.node_type === WORKFLOW_NODE_NOTICE) {
                        await ctx.model
                            .from('ejyy_ask_for_leave_flow')
                            .where('id', node.id)
                            .update({ finish: TRUE, finished_at });
                        // 添加推送抄送
                    } else {
                        await ctx.model
                            .from('ejyy_ask_for_leave_flow')
                            .where('id', node.id)
                            .update({ finish: TRUE });
                    }
                }
            }

            const complete = await ctx.model
                .from('ejyy_ask_for_leave_flow')
                .where('parent_id', id)
                .orderBy('id', 'desc')
                .first();

            if (complete.finish === TRUE) {
                await ctx.model
                    .from('ejyy_ask_for_leave')
                    .where('id', id)
                    .update({ step: complete.step, success: TRUE });

                workflowService.noticeResult(ctx.model, {
                    id,
                    refer: 'leave',
                    success: TRUE,
                    reason: '',
                    created_by: flowInfo.created_by,
                    time: moment(finished_at).format('YYYY-MM-DD HH:mm:ss'),
                    digest: `${moment(flowInfo.begin_date).format('YYYY-MM-DD')}请假${flowInfo.total}天`
                });
            }
        }

        ctx.body = {
            code: SUCCESS
        };
    }
};

export default PcLeaveFlowAction;
