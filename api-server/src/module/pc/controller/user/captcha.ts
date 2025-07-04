/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import { Action } from '~/types/action';
import { SUCCESS } from '~/constant/code';
import svgCaptcha from 'svg-captcha';
import config from '~/config';

const PcUserCaptchaAction = <Action>{
    router: {
        path: '/user/captcha',
        method: 'get',
        authRequired: false
    },

    response: async ctx => {
        const captcha = svgCaptcha.create({
            size: 4,
            ignoreChars: '0o1il',
            noise: 1,
            color: true,
            background: '#fff',
            height: 72,
            width: 240,
            fontSize: 66
        });

        ctx.session.loginCaptcha = captcha.text.toLowerCase();

        ctx.body = {
            code: SUCCESS,
            data: {
                img: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
                expire: config.session.maxAge
            }
        };
    }
};

export default PcUserCaptchaAction;
