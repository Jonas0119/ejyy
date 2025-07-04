/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import * as ROLE from '~/constant/role_access';
import { FALSE } from '~/constant/status';

interface RequestBody {
    page_num: number;
    page_size: number;
    name?: string;
    phone?: string;
}

const PcColleagueListAction = <Action>{
    router: {
        path: '/colleague/list',
        method: 'post',
        authRequired: true,
        roles: [ROLE.ANYONE]
    },
    validator: {
        body: [
            {
                name: 'page_num',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'page_size',
                regex: /^\d+$/,
                required: true
            },
            {
                name: 'string',
                min: 2
            },
            {
                name: 'phone',
                regex: /^1\d{10}$/
            }
        ]
    },
    response: async ctx => {
        const { page_num, page_size, name, phone } = <RequestBody>ctx.request.body;
        const where = {};

        if (name) {
            where['ejyy_property_company_user.real_name'] = name;
        }

        if (phone) {
            where['ejyy_property_company_user.phone'] = phone;
        }

        const list = await ctx.model
            .from('ejyy_property_company_user')
            .leftJoin(
                'ejyy_property_company_department',
                'ejyy_property_company_department.id',
                'ejyy_property_company_user.department_id'
            )
            .leftJoin('ejyy_property_company_job', 'ejyy_property_company_job.id', 'ejyy_property_company_user.job_id')
            .leftJoin(
                'ejyy_wechat_official_accounts_user',
                'ejyy_wechat_official_accounts_user.union_id',
                'ejyy_property_company_user.union_id'
            )
            .andWhere('ejyy_property_company_user.leave_office', FALSE)
            .andWhere(where)
            .select(ctx.model.raw('SQL_CALC_FOUND_ROWS ejyy_property_company_user.id'))
            .select(
                'ejyy_property_company_user.id',
                'ejyy_property_company_user.real_name',
                'ejyy_property_company_user.phone',
                'ejyy_property_company_department.name as department',
                'ejyy_property_company_job.name as job',
                'ejyy_wechat_official_accounts_user.subscribed'
            )
            .limit(page_size)
            .offset((page_num - 1) * page_size)
            .orderBy('id', 'desc');

        const [res] = await ctx.model.select(ctx.model.raw('found_rows() AS total'));

        ctx.body = {
            code: SUCCESS,
            data: {
                list,
                total: res.total,
                page_amount: Math.ceil(res.total / page_size),
                page_num,
                page_size
            }
        };
    }
};

export default PcColleagueListAction;
