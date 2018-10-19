import _ from 'lodash'

import ajax from '../util/ajax'
import { url, api } from '../config/api'

const initState = {
  // 完成任务数
  finishCount: 0,
  // 进行中任务数
  ingCount: 0,
  // 延期任务数
  postponeCount: 0,
  /**
   * [team 小组任务信息]
   * @type {Object Array}
   *        id          {Number}       任务id
   *        taskCentent {String}       任务详情
   *
   *        userGroupId {String}       当前任务挂载的小组id
   *        userGroup   {Object}       当前任务挂载的小组对象
   *
   *        endTime     {Number}       任务截止时间 时间戳
   *        finishTime  {Number}       任务完成时间 若没有值为[null]
   *
   *        rawAddTime  {Number}       添加时间 时间戳
   *
   *        status      {String}       任务状态 0:延期 1:完成 2:进行中
   *
   *        userinfos   {Object Array} 参数者信息
   *          id            {Number} 参与者id
   *          nickName      {String} 参与者昵称
   *          avatarUrl     {String} 参与者头像
   *          isGroupLeader {String} 是否是小组管理员 1:是 0:否
   */
  data: [],

  /* 状态 */
  get_task_loading: false,
  get_task_refreshing: 0,
  get_task_init: false,
  get_task_query: {},
  get_task_msg: ''
}

const get_task_loading = 'task/get_task_loading'
const get_task_loaded = 'task/get_task_loaded'
const get_task_fail = 'task/get_task_fail'
const get_task_success = 'task/get_task_success'

export const getTaskLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_loading })
export const getTaskLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_loaded })
export const getTaskFail = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_fail })
export const getTaskSuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_success })

/**
 * [getTask 获取个人任务列表]
 * @param  {Object}   payload     [请求参数]
 * @param  {Boolean}  isRefresh   [是否刷新]
 * @param  {Boolean}  ignoreCache [是否忽略缓存]
 * @return {[err, res]}
 */
export function getMyTask (
  payload = {},
  {
    isRefresh,
    ignoreCache
  } = {}
) {
  return async (dispatch, getState) => {
    const {
      user: {
        id,
        currentTeamId
      },
      task: {
        get_task_loading: loading,
        get_task_init,
        get_task_query,
        data
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    const assignQuery = {
      userId: id,
      ...get_task_query,
      ...payload
    }

    if (
      get_task_init &&
      !isRefresh &&
      !ignoreCache &&
      _.isEqual(payload, assignQuery)
    ) {
      return [null, data]
    }

    dispatch(getTaskLoading({}, isRefresh))

    const [err, res] = await ajax(url.server + api.task.list, assignQuery)

    dispatch(getTaskLoaded({}, isRefresh))

    if (err) {
      dispatch(getTaskFail(err, isRefresh))

      return [err]
    }

    const {
      finishCount,
      ingCount,
      postponeCount,

      tasks,
    } = res

    dispatch(getTaskSuccess({
      finishCount,
      ingCount,
      postponeCount,

      get_task_query: assignQuery,
      data: tasks.map(v => ({
        ...v,

        // [Number Array] 任务参与者id
        member: v.userinfos.map(v => v.id)
      }))
    }))

    return [null, res]
  }
}

/* reducer */
export const reducer = (state = initState, action) => {
  const {
    type,
    payload = {},
    isRefresh
  } = action

  switch (type) {
    case get_task_loading:
      return {
        ...state,

        get_task_msg: '',
        get_task_loading: true,
        get_task_refreshing: isRefresh ? 1 : state.get_task_refreshing
      }
    case get_task_loaded:
      return {
        ...state,

        get_task_loading: false
      }
    case get_task_fail:
      return {
        ...state,

        get_task_msg: payload,
        get_task_refreshing: isRefresh ? -1 : state.get_task_refreshing
      }
    case get_task_success:
      return {
        ...state,
        ...payload,

        get_task_init: true,
        get_task_refreshing: isRefresh ? 2 : state.get_task_refreshing
      }

    default:
      return state
  }
}
/* end reducer */
