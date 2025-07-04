/**
 * +----------------------------------------------------------------------
 * | 开源物业管理系统，敬请使用
 * +----------------------------------------------------------------------
 */

export const WORKFLOW_NODE_INITIATE = {
    workflow_id: undefined,
    id: undefined,
    type: 1,
    next: undefined,
    from_user_ids: [],
    from_deparment_ids: [],
    error: false
};

export const WORKFLOW_NODE_APPROVER = {
    id: undefined,
    type: 2,
    relation_user_id: undefined,
    applicant_assign: 0,
    next: undefined,
    error: true
};

export const WORKFLOW_NODE_NOTICE = {
    id: undefined,
    type: 3,
    relation_user_id: undefined,
    next: undefined,
    error: true
};

export const WORKFLOW_NODE_CONDITION = {
    id: undefined,
    type: 4,
    name: '',
    category: undefined,
    value: [null, null],
    opt: undefined,
    opt_first_equal: 0,
    opt_second_equal: 0,
    next: undefined,
    error: true
};

export const WORKFLOW_NODE_JUDGE = {
    id: undefined,
    type: 5,
    condition_list: [WORKFLOW_NODE_CONDITION, WORKFLOW_NODE_CONDITION],
    next: undefined
};
