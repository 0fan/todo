/* action */
// 获取小组列表
export const get_data_loading = 'team/get_data_loading'
export const get_data_loaded = 'team/get_data_loaded'
export const get_data_fail = 'team/get_data_fail'
export const get_data_success = 'team/get_data_success'
// 添加小组
export const add_team_loading = 'team/add_loading'
export const add_team_loaded = 'team/add_loaded'
export const add_team_fail = 'team/add_fail'
export const add_team_success = 'team/add_success'
// 修改小组
export const edit_team_loading = 'team/edit_loading'
export const edit_team_loaded = 'team/edit_loaded'
export const edit_team_fail = 'team/edit_fail'
export const edit_team_success = 'team/edit_success'
// 删除小组
export const remove_team_loading = 'team/remove_loading'
export const remove_team_loaded = 'team/remove_loaded'
export const remove_team_fail = 'team/remove_fail'
export const remove_team_success = 'team/remove_success'
// 获取小组任务列表
export const get_task_data_loading = 'team/get_task_data_loading'
export const get_task_data_loaded = 'team/get_task_data_loaded'
export const get_task_data_fail = 'team/get_task_data_fail'
export const get_task_data_success = 'team/get_task_data_success'
// 添加任务
export const add_team_task_loading = 'team/add_team_task_loading'
export const add_team_task_loaded = 'team/add_team_task_loaded'
export const add_team_task_fail = 'team/add_team_task_fail'
export const add_team_task_success = 'team/add_team_task_success'
// 修改任务
export const edit_team_task_loading = 'team/edit_team_task_loading'
export const edit_team_task_loaded = 'team/edit_team_task_loaded'
export const edit_team_task_fail = 'team/edit_team_task_fail'
export const edit_team_task_success = 'team/edit_team_task_success'
// 删除任务
export const remove_team_task_loading = 'team/remove_team_task_loading'
export const remove_team_task_loaded = 'team/remove_team_task_loaded'
export const remove_team_task_fail = 'team/remove_team_task_fail'
export const remove_team_task_success = 'team/remove_team_task_success'
// 获取小组成员列表
export const get_member_data_loading = 'team/get_member_data_loading'
export const get_member_data_loaded = 'team/get_member_data_loaded'
export const get_member_data_fail = 'team/get_member_data_fxail'
export const get_member_data_success = 'team/get_member_data_success'
// 添加成员
export const add_team_member_loading = 'team/add_team_member_loading'
export const add_team_member_loaded = 'team/add_team_member_loaded'
export const add_team_member_fail = 'team/add_team_member_fail'
export const add_team_member_success = 'team/add_team_member_success'
// 删除成员
export const remove_team_member_loading = 'team/remove_team_member_loading'
export const remove_team_member_loaded = 'team/remove_team_member_loaded'
export const remove_team_member_fail = 'team/remove_team_member_fail'
export const remove_team_member_success = 'team/remove_team_member_success'
/* end action */

/* action creator */
// 获取小组列表
export const getDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_loading })
export const getDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_loaded })
export const getDataFail = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_fail })
export const getDataSuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_success })
// 添加小组
export const addTeamLoading = (payload) => ({ payload, type: add_team_loading })
export const addTeamLoaded = (payload) => ({ payload, type: add_team_loaded })
export const addTeamFail = (payload) => ({ payload, type: add_team_fail })
export const addTeamSuccess = (payload) => ({ payload, type: add_team_success })
// 修改小组
export const editTeamLoading = (payload) => ({ payload, type: edit_team_loading })
export const editTeamLoaded = (payload) => ({ payload, type: edit_team_loaded })
export const editTeamFail = (payload) => ({ payload, type: edit_team_fail })
export const editTeamSuccess = (payload) => ({ payload, type: edit_team_success })
// 删除小组
export const removeTeamLoading = (payload) => ({ payload, type: remove_team_loading })
export const removeTeamLoaded = (payload) => ({ payload, type: remove_team_loaded })
export const removeTeamFail = (payload) => ({ payload, type: remove_team_fail })
export const removeTeamSuccess = (payload) => ({ payload, type: remove_team_success })
// 获取小组任务列表
export const getTaskDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_loading })
export const getTaskDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_loaded })
export const getTaskDataFail = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_fail })
export const getTaskDataSuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_success })
// 获取小组成员列表
export const getMemberDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_loading })
export const getMemberDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_loaded })
export const getMemberDataFail = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_fail })
export const getMemberDataSuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_success })
/* /action creator */
