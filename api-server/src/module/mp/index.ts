/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import kjhlog from '~/utils/kjhlog';

import path from 'path';
import { Context } from 'koa';
import { Action } from '~/types/action';
import KoaRouter from 'koa-router';
import * as MpModuleRouter from './router';
import config from '~/config';
import validatorService from '~/service/validator';
import { PARAMS_ERROR, USER_INFO_UNINTACT } from '~/constant/code';

function MpModule(appRouter: KoaRouter) {
    for (const name in MpModuleRouter) {
        const { router, validator, response } = <Action>MpModuleRouter[name];

        appRouter[router.method](path.posix.join('/mp', router.path), async (ctx: Context, next) => {
            if (router.authRequired) {
                const token = ctx.request.header['ejyy-mp-token'];

                if (!token) {
                    return (ctx.status = 401);
                }

                ctx.mpUserInfo = await ctx.model
                    .table('ejyy_wechat_mp_auth')
                    .leftJoin('ejyy_wechat_mp_user', 'ejyy_wechat_mp_user.id', 'ejyy_wechat_mp_auth.wechat_mp_user_id')
                    .leftJoin(
                        'ejyy_wechat_official_accounts_user',
                        'ejyy_wechat_official_accounts_user.union_id',
                        'ejyy_wechat_mp_user.union_id'
                    )
                    .where('ejyy_wechat_mp_auth.token', token)
                    .select(
                        'ejyy_wechat_mp_user.id',
                        'ejyy_wechat_mp_user.nick_name',
                        'ejyy_wechat_mp_user.phone',
                        'ejyy_wechat_mp_user.real_name',
                        'ejyy_wechat_mp_user.idcard',
                        'ejyy_wechat_mp_user.gender',
                        'ejyy_wechat_mp_user.avatar_url',
                        'ejyy_wechat_mp_user.signature',
                        'ejyy_wechat_mp_user.intact',
                        'ejyy_wechat_mp_user.created_at',
                        'ejyy_wechat_official_accounts_user.subscribed'
                    )
                    .first();

                if (!ctx.mpUserInfo) {
                    return (ctx.status = 401);
                }

                if (router.verifyIntact && !ctx.mpUserInfo.intact) {
                    return (ctx.body = {
                        code: USER_INFO_UNINTACT,
                        message: '未完善身份信息，非法操作'
                    });
                }
            }

            const vs = validatorService(ctx, validator);

            if (!vs.success) {
                return (ctx.body = {
                    code: PARAMS_ERROR,
                    message: vs.message
                });
            }

            await response.apply(this, [ctx, next]);
        });

        if (config.debug) {
            kjhlog.info(`${name} mounted and request from ${path.posix.join('/mp', router.path)} by ${router.method}`);
        }
    }
}

export default MpModule;
