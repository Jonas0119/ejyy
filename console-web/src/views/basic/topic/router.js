/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

const ROLES = require('@/constants/role');

module.exports = {
    path: 'topic',
    meta: {
        authRequired: true,
        title: '专题管理',
        layout: 'sider',
        icon: 'topic',
        nav: true,
        roles: [ROLES.ZTGL]
    },
    component: () => import('./'),
    children: [
        {
            path: '',
            meta: {
                authRequired: true,
                title: '全部专题',
                layout: 'sider',
                nav: true,
                roles: [ROLES.ZTGL]
            },
            component: () => import('./list')
        },
        {
            path: 'create',
            meta: {
                authRequired: true,
                title: '创建专题',
                layout: 'sider',
                nav: true,
                roles: [ROLES.ZTGL]
            },
            component: () => import('./create')
        },
        {
            path: 'update/:id',
            meta: {
                authRequired: true,
                title: '修改专题',
                layout: 'sider',
                nav: false,
                roles: [ROLES.ZTGL]
            },
            component: () => import('./update')
        },
        {
            path: 'preview/:id',
            meta: {
                authRequired: true,
                title: '预览专题',
                layout: 'sider',
                nav: false,
                roles: [ROLES.ZTGL]
            },
            component: () => import('./preview')
        }
    ]
};
