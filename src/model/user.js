import { navigateTo, switchTab } from '@tarojs/taro'
import ajax, { setToken } from '../util/ajax'
import store from '../util/store'
import { getCode } from '../util/wx'

import { getTeam, getTeamTask, getTeamMember } from './team'

import { url, api } from '../config/api'

const initState = {
  id: '',
  token: '',

  /**
   * [userType 用户类型]
   * @type {String}
   * @0 {封禁用户}
   * @1 {普通用户}
   * @2 {创建者}
   * @3 {新用户}
   */
  userType: '',

  // 头像
  avatarUrl: '',
  // 昵称
  nickName: '',
  // 性别
  gender: '',
  // 国家
  country: '',
  // 省份
  province: '',
  // 城市
  city: '',

  // 当前小组id
  currentTeamId: 0,

  // 是否登录
  isLogin: false,

  // 常量
  // 小组最大数 0则不限制
  LIMIT_TEAM: 3,
  // 每个小组的成员最大数 0则不限制
  LIMIT_TEAM_MEMBER: 0,
  // 每个小组的任务最大数 0则不限制
  LIMIT_TEAM_TASK: 0,

  /* 状态 */
  login_loading: false,
  login_msg: false
}

/* action */
// 登录
const login_loading = 'login_loading'
const login_loaded = 'login_loaded'
const login_fail = 'login_fail'
const login_success = 'login_success'
// 切换小组
const change_current_team = 'change_current_team'
/* end action */

/* action creator */
// 登录
export const loginLoading = payload => ({ payload, type: login_loading })
export const loginLoaded = payload => ({ payload, type: login_loaded })
export const loginFail = payload => ({ payload, type: login_fail })
export const loginSuccess = payload => ({ payload, type: login_success })
// 切换小组
// export const changeCurrentTeam = payload => ({ payload, type: change_current_team })
/* /action creator */

/* method */
/**
 * [login 登录]
 * @param  {Object} payload [登录请求参数 userData]
 * @param  {String} r       [登录成功后跳转的地址]
 * @return {[err, res]}
 */
export function login (payload = {}, r) {
  return async (dispatch, getState) => {
    const {
      user: {
        login_loading: loading
      }
    } = getState()

    if (loading) {
      return ['重复请求']
    }

    dispatch(loginLoading())

    const code = await getCode()

    if (!code) {
      dispatch(loginLoaded())
      dispatch(loginFail('没有获取到code'))

      return ['没有获取到code']
    }

    const [err, res] = await ajax(url.server + api.user.login, {
      code,

      ...payload,
    })

    dispatch(loginLoaded())

    if (err) {
      dispatch(loginFail(err))

      return [err]
    }

    const {
      id,
      token,
      userType
    } = res

    dispatch(loginSuccess({
      id,
      token,
      userType,

      ...payload
    }))

    // 设置全局请求token
    setToken(token)

    // 缓存数据
    store.set({
      token,
      user: {
        id,
        userType,
        ...payload
      }
    })

    // 登录成功后初始化数据
    // 获取小组列表
    //  -> 小组列表数据成功后会切换第一个小组为当前小组
    //  -> 切换小组后会获取当前小组的成员和任务　
    dispatch(getTeam({ userId: id }))
    // 获取个人任务
    // 获取小组类型

    // 如果是新用户就必须要创建小组才能进行其他操作
    //
    // 那如果是一个新用户被邀请呢
    // 被邀请加入小组前是必须要登录的
    // 如果按照这个逻辑,登陆后就跳到创建小组页面去了
    // 必须要重新进入邀请页面才能加入小组
    //
    // 还有从小程序消息提示进来
    // 如果登录失效也得重新登录

    // 所以增加一个重定向参数, 如果指定了具体的跳转地址则登录成功后跳到指定的地址去
    if (r) {
      navigateTo({
        url: r
      })
    } else {
      if (userType === '3') {
        navigateTo({
          url: '/pages/create_team/index?from=是从登录没有小组进来哒&r=/pages/i/index'
        })
      } else {
        switchTab({
          url: '/pages/my_task/index'
        })
      }
    }

    return [null, res]
  }
}

// 切换小组
export function changeCurrentTeam (payload) {
  return async (dispatch, getState) => {
    await dispatch({ payload, type: change_current_team })

    const [err1, res1] = await dispatch(getTeamTask({}, { teamId: payload }))
    const [err2, res2] = await dispatch(getTeamMember({}, { teamId: payload }))

    if (err1 || err2) {
      return [[err1, err2]]
    }

    return [null, [res1, res2]]
  }
}
/* end method */

/* reducer */
export const reducer = (state = initState, action) => {
  const {
    type,
    payload = {}
  } = action

  switch (type) {
    // 登录
    case login_loading:
      return {
        ...state,

        login_msg: '',
        login_loading: true
      }
    case login_loaded:
      return {
        ...state,

        login_loading: false
      }
    case login_fail:
      return {
        ...state,

        login_msg: payload
      }
    case login_success:
      return {
        ...state,
        ...payload,

        isLogin: true
      }

    // 切换小组
    case change_current_team:
      return {
        ...state,

        currentTeamId: payload
      }

    default:
      return state
  }
}
/* end reducer */
