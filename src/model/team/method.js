import * as actionCreator from './action'
import ajax from '../../util/ajax'
import { showToast } from '../../util/wx'

import _ from 'lodash'

import { changeCurrentTeam } from '../user'

import { url, api } from '../../config/api'

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

    dispatch(actionCreator.getDataLoading({}, isRefresh))

    const [err, res] = await ajax(url.server + api.team.list, assignQuery)

    dispatch(actionCreator.getDataLoaded({}, isRefresh))

    if (err) {
      dispatch(actionCreator.getDataFail(err, isRefresh))

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

    dispatch(actionCreator.getDataSuccess({
      get_data_query: assignQuery,
      data: _data
    }, isRefresh))

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

    dispatch(actionCreator.getTaskDataLoading({
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

    dispatch(actionCreator.getTaskDataLoaded({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_task_data_loading: false,
        }
      }
    }))

    if (err) {
      dispatch(actionCreator.getTaskDataFail({
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

    dispatch(actionCreator.getTaskDataSuccess({
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

    dispatch(actionCreator.getMemberDataLoading({
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

    dispatch(actionCreator.getMemberDataLoaded({
      data: {
        ...data,

        [teamId]: {
          ...data[teamId],

          get_member_data_loading: false,
        }
      }
    }))

    if (err) {
      dispatch(actionCreator.getMemberDataFail({
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

    dispatch(actionCreator.getMemberDataSuccess({
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
