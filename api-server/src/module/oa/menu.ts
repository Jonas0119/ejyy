/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

import config from '~/config';

export default {
    button: [
        {
            name: '我是业主',
            sub_button: [
                {
                    type: 'miniprogram',
                    name: '首页',
                    appid: config.wechat.ump.appid,
                    pagepath: '/pages/home/index',
                    url: '/pages/home/index'
                },
                {
                    type: 'miniprogram',
                    name: '维修维护',
                    appid: config.wechat.ump.appid,
                    pagepath: '/pages/repair/create',
                    url: '/pages/repair/create'
                },
                {
                    type: 'miniprogram',
                    name: '投诉建议',
                    appid: config.wechat.ump.appid,
                    pagepath: '/pages/complain/create',
                    url: '/pages/complain/create'
                },
                {
                    type: 'miniprogram',
                    name: '小区挪车',
                    appid: config.wechat.ump.appid,
                    pagepath: '/pages/move_car/create',
                    url: '/pages/move_car/create'
                },
                {
                    type: 'miniprogram',
                    name: '业主名片',
                    appid: config.wechat.ump.appid,
                    pagepath: '/pages/zone/card',
                    url: '/pages/zone/card'
                }
            ]
        },
        {
            name: '我是物业',
            sub_button: [
                {
                    type: 'miniprogram',
                    name: '掌上办公',
                    appid: config.wechat.pmp.appid,
                    pagepath: '/pages/home/index',
                    url: '/pages/home/index'
                },
                {
                    type: 'miniprogram',
                    name: '上班打卡',
                    appid: config.wechat.pmp.appid,
                    pagepath: '/pages/sign/begin',
                    url: '/pages/sign/begin'
                },
                {
                    type: 'miniprogram',
                    name: '维修工单',
                    appid: config.wechat.pmp.appid,
                    pagepath: '/pages/repair/index',
                    url: '/pages/repair/index'
                },
                {
                    type: 'miniprogram',
                    name: '巡检任务',
                    appid: config.wechat.pmp.appid,
                    pagepath: '/pages/mission/index',
                    url: '/pages/mission/index'
                },
                {
                    type: 'miniprogram',
                    name: '请假申请',
                    appid: config.wechat.pmp.appid,
                    pagepath: '/pages/leave/index',
                    url: '/pages/leave/index'
                }
            ]
        },
        {
            type: 'view',
            name: '公测招募'
        }
    ]
};
