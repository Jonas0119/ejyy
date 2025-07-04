/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

const ROLES = require('@/constants/role');

module.exports = {
    path: 'hr',
    meta: {
        title: '人力资源',
        authRequired: true,
        layout: 'sider',
        nav: true,
        icon: 'hr',
        roles: [ROLES.ANYONE]
    },
    component: () => import('./index'),
    redirect: '/oa/hr/colleague',
    children: [
        {
            path: '',
            meta: {
                title: '员工管理',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.RLZY]
            },
            component: () => import('./main/list')
        },
        {
            path: 'detail/:id',
            meta: {
                title: '员工信息',
                authRequired: true,
                layout: 'sider',
                nav: false,
                roles: [ROLES.RLZY]
            },
            component: () => import('./main/detail')
        },
        {
            path: 'join',
            meta: {
                title: '员工入职',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.RLZY]
            },
            component: () => import('./main/join')
        },
        {
            path: 'update/:id',
            meta: {
                title: '更新人事信息',
                authRequired: true,
                layout: 'sider',
                nav: false,
                roles: [ROLES.RLZY]
            },
            component: () => import('./main/update')
        },
        {
            path: 'sign/:id',
            meta: {
                title: '考勤信息',
                authRequired: true,
                layout: 'sider',
                nav: false,
                roles: [ROLES.RLZY]
            },
            component: () => import('./main/sign')
        },
        {
            path: 'colleague',
            meta: {
                title: '通讯录',
                authRequired: true,
                layout: 'sider',
                nav: true,
                roles: [ROLES.ANYONE]
            },
            component: () => import('./colleague'),
            children: [
                {
                    path: '',
                    meta: {
                        title: '我的同事',
                        authRequired: true,
                        layout: 'sider',
                        nav: false,
                        roles: [ROLES.ANYONE]
                    },
                    component: () => import('./colleague/list')
                },
                {
                    path: 'detail/:id',
                    meta: {
                        title: '同事信息',
                        authRequired: true,
                        layout: 'sider',
                        nav: false,
                        roles: [ROLES.ANYONE]
                    },
                    component: () => import('./colleague/detail')
                }
            ]
        }
    ]
};
