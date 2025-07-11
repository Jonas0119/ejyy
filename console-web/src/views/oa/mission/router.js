/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

const ROLES = require('@/constants/role');

module.exports = {
    path: 'mission',
    meta: {
        title: '巡检任务',
        authRequired: true,
        layout: 'sider',
        nav: true,
        icon: 'mission',
        roles: [ROLES.ANYONE]
    },
    component: () => import('./index'),
    children: [
        {
            path: '',
            meta: {
                title: '全部任务',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.ANYONE]
            },
            component: () => import('./main')
        },
        {
            path: 'detail/:id',
            meta: {
                title: '任务详情',
                authRequired: true,
                layout: 'sider',
                nav: false,
                roles: [ROLES.ANYONE]
            },
            component: () => import('./detail')
        },
        {
            path: 'submit/:id',
            meta: {
                title: '任务提交',
                authRequired: true,
                layout: 'sider',
                nav: false,
                roles: [ROLES.ANYONE]
            },
            component: () => import('./submit')
        },
        {
            path: 'dispose',
            meta: {
                title: '分配任务',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.XJRW]
            },
            component: () => import('./dispose')
        },
        {
            path: 'line',
            meta: {
                title: '巡检路线',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.XJRW]
            },
            component: () => import('./line')
        },
        {
            path: 'point',
            meta: {
                title: '巡检点位',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.XJRW]
            },
            component: () => import('./point')
        },
        {
            path: 'category',
            meta: {
                title: '巡检分类',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.XJRW]
            },
            component: () => import('./category')
        }
    ]
};
