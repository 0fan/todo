import ajax from '../util/ajax'
import { showToast } from '../util/wx'

import _ from 'lodash'

import { changeCurrentTeam } from './user'

import { url, api } from '../config/api'

const initState = {
  /**
   * [data 小组信息]
   * @type {Object}
   *       {key}         小组id
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
   *       isCreator     {Boolean}       当前登录用户是否是该小组管理员
   */
  data: {},

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

  add_team_loading: false,
  add_team_msg: '',

  edit_team_loading: false,
  edit_team_msg: '',

  remove_team_loading: false,
  remove_team_msg: '',

  add_team_task_loading: false,
  add_team_task_msg: '',

  edit_team_task_loading: false,
  edit_team_task_msg: '',

  remove_team_task_loading: false,
  remove_team_task_msg: '',

  add_team_member_loading: false,
  add_team_member_msg: '',

  remove_team_member_loading: false,
  remove_team_member_msg: '',
}

/* action */
// 获取小组列表
const get_data_loading = 'team/get_data_loading'
const get_data_loaded = 'team/get_data_loaded'
const get_data_fail = 'team/get_data_fail'
const get_data_success = 'team/get_data_success'
// 添加小组
const add_team_loading = 'team/add_loading'
const add_team_loaded = 'team/add_loaded'
const add_team_fail = 'team/add_fail'
const add_team_success = 'team/add_success'
// 修改小组
const edit_team_loading = 'team/edit_loading'
const edit_team_loaded = 'team/edit_loaded'
const edit_team_fail = 'team/edit_fail'
const edit_team_success = 'team/edit_success'
// 删除小组
const remove_team_loading = 'team/remove_loading'
const remove_team_loaded = 'team/remove_loaded'
const remove_team_fail = 'team/remove_fail'
const remove_team_success = 'team/remove_success'
// 获取小组任务列表
const get_task_data_loading = 'team/get_task_data_loading'
const get_task_data_loaded = 'team/get_task_data_loaded'
const get_task_data_fail = 'team/get_task_data_fail'
const get_task_data_success = 'team/get_task_data_success'
// 添加任务
const add_team_task_loading = 'team/add_team_task_loading'
const add_team_task_loaded = 'team/add_team_task_loaded'
const add_team_task_fail = 'team/add_team_task_fail'
const add_team_task_success = 'team/add_team_task_success'
// 修改任务
const edit_team_task_loading = 'team/edit_team_task_loading'
const edit_team_task_loaded = 'team/edit_team_task_loaded'
const edit_team_task_fail = 'team/edit_team_task_fail'
const edit_team_task_success = 'team/edit_team_task_success'
// 删除任务
const remove_team_task_loading = 'team/remove_team_task_loading'
const remove_team_task_loaded = 'team/remove_team_task_loaded'
const remove_team_task_fail = 'team/remove_team_task_fail'
const remove_team_task_success = 'team/remove_team_task_success'
// 获取小组成员列表
const get_member_data_loading = 'team/get_member_data_loading'
const get_member_data_loaded = 'team/get_member_data_loaded'
const get_member_data_fail = 'team/get_member_data_fxail'
const get_member_data_success = 'team/get_member_data_success'
// 添加成员
const add_team_member_loading = 'team/add_team_member_loading'
const add_team_member_loaded = 'team/add_team_member_loaded'
const add_team_member_fail = 'team/add_team_member_fail'
const add_team_member_success = 'team/add_team_member_success'
// 删除成员
const remove_team_member_loading = 'team/remove_team_member_loading'
const remove_team_member_loaded = 'team/remove_team_member_loaded'
const remove_team_member_fail = 'team/remove_team_member_fail'
const remove_team_member_success = 'team/remove_team_member_success'
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

/**
 * [getTeam 获取小组列表]
 * @param  {Object}   payload     [请求参数]
 * @param  {Boolean}  isRefresh   [是否刷新]
 * @param  {Boolean}  ignoreCache [是否忽略缓存]
 * @param  {Number}   teamId      [小组id,如果传递了小组id,则列表获取成后如果有这个id的小组则切换到这个小组,如果没有则切换到第一个小组]
 * @return {[err, res]}
 */
export function getTeam (
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
        id,
        currentTeamId
      },
      team: {
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
      dispatch(getDataFail(err, isRefresh))

      return [err]
    }

    const {
      // 这个是自己创建的小组
      creatorGroup = [],
      // 这个是加入的小组
      memberGroup = [],
    } = res

    let _data = {}
    let firstTeam = null

    creatorGroup.map(v => ({ ...v, isCreator: true })).concat(memberGroup).forEach(v => {
      if (!firstTeam) {
        firstTeam = v
      }

      _data[v.id] = {
        ...v,

        // 初始化一些数据
        finishCount: 0,
        ingCount: 0,
        postponeCount: 0,

        task: [],
        member: [],

        get_task_data_loading: false,
        get_task_data_refreshing: 0,
        get_task_data_init: false,
        get_task_data_msg: '',
        get_task_data_query: {
          /**
           * sortType 排序类型。
           * defaultSort 默认排序
           * taskStatusSort1 （规则顺序为：第一次点击时延期第一、进行中第二、已完成第三）时间顺序适应时间排序规则
           * taskStatusSort2
           * taskStatusSort3
           * groupSort 按小组排序（规则为：按加入小组的时间先到后的顺序排序）时间顺序适应时间排序规则
          */
          sortType: 'defaultSort',
          groupId: v.id,
          userId: id,
        },

        get_member_data_loading: false,
        get_member_data_refreshing: 0,
        get_member_data_init: false,
        get_member_data_msg: '',
        get_member_data_query: {
          groupId: v.id,
        },
      }
    })

    dispatch(getDataSuccess({
      get_data_query: assignQuery,
      data: _data
    }, isRefresh))

    if (teamId && )

    // 如果存在至少一个小组
    if (firstTeam) {

      // 如果传递了小组id,且列表也有数据则切换到这个小组
      if (teamId && _data[teamId]) {
        dispatch(changeCurrentTeam(teamId))
      } else {
        // 如果没有传递小组id则默认当前小组为第一个小组
        dispatch(changeCurrentTeam(firstTeam.id))
      }

    } else {
      showToast('没有小组呀')
      console.log('没有小组呀')
    }

    return [null, res]
  }
}

/**
 * [addTeam 添加小组]
 * @param {Object} payload [请求参数]
 */
export function addTeam (
  payload = {}
) {
  return async (dispatch, getState) => {
    const {
      team: {
        add_team_loading: loading
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    dispatch(addTeamLoading())

    const [err, res] = await ajax(url.server + api.team.add, payload)

    dispatch(addTeamLoaded())

    if (err) {
      dispatch(addTeamFail(err))
    }

    const {
      id
    } = res

    await dispatch(addTeamSuccess())
    // 添加小组成功后重新获取列表且设置到添加的小组为当前小组
    dispatch(getTeam({}, { teamId: id }))

    return [null, res]
  }
}

/**
 * [editTeam 修改小组]
 * @param {Object} payload [请求参数]
 */
export function editTeam (
  payload = {}
) {
  return async (dispatch, getState) => {
    const {
      team: {
        edit_team_loading: loading
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    dispatch(editTeamLoading())

    const [err, res] = await ajax(url.server + api.team.edit, payload)

    dispatch(editTeamLoaded())

    if (err) {
      dispatch(editTeamFail(err))
    }

    await dispatch(editTeamSuccess())
    // 添加小组成功后重新获取列表
    dispatch(getTeam({}, { teamId: payload.groupId }))

    return [null, res]
  }
}

/**
 * [removeTeam 删除/退出小组]
 * @param {Object} payload [请求参数]
 */
export function removeTeam (
  payload = {}
) {
  return async (dispatch, getState) => {
    const {
      team: {
        remove_team_loading: loading
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    dispatch(removeTeamLoading())

    const [err, res] = await ajax(url.server + api.team.remove, payload)

    dispatch(removeTeamLoaded())

    if (err) {
      dispatch(removeTeamFail(err))
    }

    await dispatch(removeTeamSuccess())
    // 添加小组成功后重新获取列表
    dispatch(getTeam({}))

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
      // user: {
      //   currentTeamId
      // },
      team: {
        data
      }
    } = getState()

    const item = data[teamId]

    if (!item) {
      return ['数据错误']
    }

    if (data[teamId].get_task_data_loading) {
      return ['重复请求']
    }

    const assignQuery = {
      ...item.get_task_data_query,
      ...payload
    }

    if (
      item.get_task_data_init &&
      !isRefresh &&
      !ignoreCache &&
      _.isEqual(payload, assignQuery)
    ) {
      return [null, item.task]
    }

    dispatch(getTaskDataLoading({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_task_data_msg: '',
          get_task_data_loading: true,
          get_task_data_refreshing: isRefresh ? 1 : data[teamId].get_task_data_refreshing
        }
      }
    }))

    const [err, res] = await ajax(url.server + api.task.team, assignQuery)

    dispatch(getTaskDataLoaded({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_task_data_loading: false,
        }
      }
    }))

    if (err) {
      dispatch(getTaskDataFail({
        data: {
          ...data,

          [teamId]: {
            ...data[teamId],

            get_task_data_msg: err,
            get_task_data_refreshing: isRefresh ? -1 : data[teamId].get_task_data_refreshing
          }
        }
      }))

      return [err]
    }

    const {
      finishCount,
      ingCount,
      postponeCount,
      tasks
    } = res

    dispatch(getTaskDataSuccess({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          finishCount,
          ingCount,
          postponeCount,
          task: tasks.map(v => ({
            ...v,

            // [Number Array] 任务参与者id
            member: v.userinfos.map(v => v.id)
          })),
          get_task_data_query: assignQuery,
          get_task_data_init: true,
          get_task_data_refreshing: isRefresh ? 2 : data[teamId].get_task_data_refreshing
        }
      }
    }))

    return [null, res]
  }
}

export function addTeamTask () {}
export function editTeamTask () {}
export function removeTeamTask () {}

/**
 * [getTeamMember 获取小组成员列表]
 * @param  {Object} payload [请求参数]
 * @param  {Number} teamId  [小组id]
 * @return {[err, res]}
 */
export function getTeamMember (
  payload = {},
  {
    isRefresh,
    ignoreCache,
    teamId
  } = {}
) {
  return async (dispatch, getState) => {
    const {
      // user: {
      //   currentTeamId
      // },
      team: {
        data
      }
    } = getState()

    const item = data[teamId]

    if (!item) {
      return ['数据错误']
    }

    if (data[teamId].get_member_data_loading) {
      return ['重复请求']
    }

    const assignQuery = {
      ...item.get_member_data_query,
      ...payload
    }

    if (
      item.get_member_data_init &&
      !isRefresh &&
      !ignoreCache &&
      _.isEqual(payload, assignQuery)
    ) {
      return [null, item.member]
    }

    dispatch(getMemberDataLoading({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_member_data_msg: '',
          get_member_data_loading: true,
          get_member_data_refreshing: isRefresh ? 1 : data[teamId].get_member_data_refreshing
        }
      }
    }))

    const [err, res] = await ajax(url.server + api.member.list, assignQuery)

    dispatch(getMemberDataLoaded({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_member_data_loading: false,
        }
      }
    }))

    if (err) {
      dispatch(getMemberDataFail({
        data: {
          ...data,

          [teamId]: {
            ...data[teamId],

            get_member_data_msg: err,
            get_member_data_refreshing: isRefresh ? -1 : data[teamId].get_member_data_refreshing
          }
        }
      }))

      return [err]
    }

    const {
      userinfos
    } = res

    dispatch(getMemberDataSuccess({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          member: userinfos,
          get_member_data_query: assignQuery,
          get_member_data_init: true,
          get_member_data_refreshing: isRefresh ? 2 : data[teamId].get_member_data_refreshing
        }
      }
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

    // 添加小组
    case add_team_loading:
      return {
        ...state,

        add_team_msg: '',
        add_team_loading: true,
      }
    case add_team_loaded:
      return {
        ...state,

        add_team_loading: false,
      }
    case add_team_fail:
      return {
        ...state,

        add_team_msg: payload,
      }
    case add_team_success:
      return {
        ...state,
        ...payload
      }

    // 修改小组
    case edit_team_loading:
      return {
        ...state,

        edit_team_msg: '',
        edit_team_loading: true,
      }
    case edit_team_loaded:
      return {
        ...state,

        edit_team_loading: false,
      }
    case edit_team_fail:
      return {
        ...state,

        edit_team_msg: payload,
      }
    case edit_team_success:
      return {
        ...state,
        ...payload
      }

    // 删除小组
    case remove_team_loading:
      return {
        ...state,

        remove_team_msg: '',
        remove_team_loading: true,
      }
    case remove_team_loaded:
      return {
        ...state,

        remove_team_loading: false,
      }
    case remove_team_fail:
      return {
        ...state,

        remove_team_msg: payload,
      }
    case remove_team_success:
      return {
        ...state,
        ...payload
      }

    // 获取小组任务列表
    case get_task_data_loading:
      return {
        ...state,
        ...payload
      }
    case get_task_data_loaded:
      return {
        ...state,
        ...payload
      }
    case get_task_data_fail:
      return {
        ...state,
        ...payload
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
        ...payload
      }
    case get_member_data_loaded:
      return {
        ...state,
        ...payload
      }
    case get_member_data_fail:
      return {
        ...state,
        ...payload
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
