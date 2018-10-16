import ajax from '../util/ajax'

import _ from 'lodash'

import { url, api } from '../config/api'

const initState = {
  /**
   * [data 小组信息]
   * @type {Object Array}
   *       id            {Number}        小组id
   *       groupName     {String}        小组名称
   *
   *       groupType     {String}        小组类型 [根据小组类型接口获取详情]
   *
   *       creator       {Number}        创建者id
   *       creatorName   {String}        创建者昵称
   *
   *       status        {Number}        状态 [暂时没用到这个字段]
   *       memberCount   {Number}        小组成员数
   *       rawAddTime    {Number}        添加时间 时间戳
   *
   *       finishCount   {Number}        完成任务数
   *       ingCount      {Number}        进行中任务数
   *       postponeCount {Number}        延期任务数
   *
   *       task          {Object Array}  任务数据
   *       member        {Object Array}  成员数据
   *
   *       isAdmin       {Boolean}       当前登录用户是否是该小组管理员
   */
  data: [],

  /**
   * [task 小组任务信息]
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
   *        status      {String}       任务状态 0:延期 1:完成 2:进行中
   *
   *        userinfos   {Object Array} 参数者信息
   *          id            {Number} 参与者id
   *          nickName      {String} 参与者昵称
   *          avatarUrl     {String} 参与者头像
   *          isGroupLeader {String} 是否是小组管理员 1:是 0:否
   */

  /**
   * [member 小组成员信息]
   * @type {Object Array}
   *       id            {Number} 用户id
   *       nickName      {String} 用户昵称
   *       avatarUrl     {String} 用户头像
   *
   *       isGroupLeader {String} 是否是小组管理员 1:是 0:否
   *
   *       rawAddTime    {Number} 添加时间 时间戳
   *       rawUpdateTime {Number} 上一次时间 时间戳
   */

  get_data_loading: false,
  get_data_refreshing: 0,
  get_data_init: false,
  get_data_msg: '',
  get_data_query: {},

  get_task_data_loading: false,
  get_task_data_refreshing: 0,
  get_task_data_init: false,
  get_task_data_msg: '',
  get_task_data_query: {},

  get_member_data_loading: false,
  get_member_data_refreshing: 0,
  get_member_data_init: false,
  get_member_data_msg: '',
  get_member_data_query: {},
}

/* action */
// 获取小组列表
const get_data_loading = 'team/get_data_loading'
const get_data_loaded = 'team/get_data_loaded'
const get_data_fail = 'team/get_data_fail'
const get_data_success = 'team/get_data_success'
// 获取小组任务列表
const get_task_data_loading = 'team/get_task_data_loading'
const get_task_data_loaded = 'team/get_task_data_loaded'
const get_task_data_fail = 'team/get_task_data_fail'
const get_task_data_success = 'team/get_task_data_success'
// 获取小组成员列表
const get_member_data_loading = 'team/get_member_data_loading'
const get_member_data_loaded = 'team/get_member_data_loaded'
const get_member_data_fail = 'team/get_member_data_fail'
const get_member_data_success = 'team/get_member_data_success'
/* end action */

/* action creator */
// 获取小组列表
export const getDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_loading })
export const getDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_loaded })
export const getDataLail = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_fail })
export const getDataLuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_data_success })
// 获取小组任务列表
export const getTaskDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_loading })
export const getTaskDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_loaded })
export const getTaskDataLail = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_fail })
export const getTaskDataLuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_task_data_success })
// 获取小组成员列表
export const getMemberDataLoading = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_loading })
export const getMemberDataLoaded = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_loaded })
export const getMemberDataLail = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_fail })
export const getMemberDataLuccess = (payload, isRefresh) => ({ payload, isRefresh, type: get_member_data_success })
/* /action creator */

/**
 * [getTeam 获取小组列表]
 * @param  {Object}   payload     [请求参数]
 * @param  {Boolean}  isRefresh   [是否刷新]
 * @param  {Boolean}  ignoreCache [是否忽略缓存]
 * @return {[err, res]}
 */
export function getTeam (
  payload = {},
  {
    isRefresh,
    ignoreCache
  } = {}
) {
  return async (dispatch, getState) => {
    const {
      user: {
        get_data_loading: loading,
        get_data_init,
        get_data_query,
        data
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    const assignQuery = {
      ...get_data_query,
      ...payload
    }

    if (
      get_data_init &&
      !isRefresh &&
      !ignoreCache &&
      _.isEqual(payload, assignQuery)
    ) {
      return [null, data]
    }
    dispatch(getDataLoading({}, isRefresh))

    const [err, res] = await ajax(url.server + api.team.list, assignQuery)

    dispatch(getDataLoaded({}, isRefresh))

    if (err) {
      dispatch(getDataLail(err, isRefresh))

      return [err]
    }

    const {
      // 这个是自己创建的小组
      creatorGroup = [],
      // 这个是加入的小组
      memberGroup = [],
    } = res

    const _data = (
      creatorGroup.map(v => ({ ...v, isCreator: true })).concat(memberGroup)
    )

    dispatch(getDataLuccess({
      get_data_query: assignQuery,
      data: _data
    }, isRefresh))

    return [null, res]
  }
}

/**
 * [getTeamTask 获取小组任务列表]
 * @param  {Object} payload [请求参数]
 * @param  {Number} teamId  [小组id]
 * @return {[err, res]}
 */
export function getTeamTask (
  payload = {},
  {
    isRefresh,
    ignoreCache,
    teamId
  } = {}
) {
  return async (dispatch, getState) => {
    const {
      user: {
        get_task_data_loading: loading,
        get_task_data_init,
        get_task_data_query,
        data
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }
  }
}

/**
 * [getTeamMember 获取小组成员列表]
 * @param  {Object} payload [请求参数]
 * @return {[err, res]}
 */
export function getTeamMember (payload = {}) {
  return async (dispatch, getState) => {
    const {
      user: {
        get_member_data_loading: loading
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }
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
    // 获取小组列表
    case get_data_loading:
      return {
        ...state,

        get_data_msg: '',
        get_data_loading: true,
        get_data_refreshing: isRefresh ? 1 : state.get_data_refreshing
      }
    case get_data_loaded:
      return {
        ...state,

        get_data_loading: false
      }
    case get_data_fail:
      return {
        ...state,

        get_data_msg: payload,
        get_data_refreshing: isRefresh ? -1 : state.get_data_refreshing
      }
    case get_data_success:
      return {
        ...state,
        ...payload,

        get_data_init: true,
        get_data_refreshing: isRefresh ? 2 : state.get_data_refreshing
      }

    // 获取小组任务列表
    case get_task_data_loading:
      return {
        ...state,

        get_task_data_msg: '',
        get_task_data_loading: true
      }
    case get_task_data_loaded:
      return {
        ...state,

        get_task_data_loading: false
      }
    case get_task_data_fail:
      return {
        ...state,

        get_task_data_msg: payload
      }
    case get_task_data_success:
      return {
        ...state,
        ...payload
      }

    // 获取小组成员列表
    case get_member_data_loading:
      return {
        ...state,

        get_member_data_msg: '',
        get_member_data_loading: true
      }
    case get_member_data_loaded:
      return {
        ...state,

        get_member_data_loading: false
      }
    case get_member_data_fail:
      return {
        ...state,

        get_member_data_msg: payload
      }
    case get_member_data_success:
      return {
        ...state,
        ...payload
      }

    default:
      return state
  }
}
/* end reducer */
