import * as action from './action'

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

/* reducer */
export const reducer = (state = initState, _action) => {
  const {
    type,
    payload = {},
    isRefresh
  } = _action

  switch (type) {
    // 获取小组列表
    case action.get_data_loading:
      return {
        ...state,

        get_data_msg: '',
        get_data_loading: true,
        get_data_refreshing: isRefresh ? 1 : state.get_data_refreshing
      }
    case action.get_data_loaded:
      return {
        ...state,

        get_data_loading: false
      }
    case action.get_data_fail:
      return {
        ...state,

        get_data_msg: payload,
        get_data_refreshing: isRefresh ? -1 : state.get_data_refreshing
      }
    case action.get_data_success:
      return {
        ...state,
        ...payload,

        get_data_init: true,
        get_data_refreshing: isRefresh ? 2 : state.get_data_refreshing
      }

    // 添加小组
    case action.add_team_loading:
      return {
        ...state,

        add_team_msg: '',
        add_team_loading: true,
      }
    case action.add_team_loaded:
      return {
        ...state,

        add_team_loading: false,
      }
    case action.add_team_fail:
      return {
        ...state,

        add_team_msg: payload,
      }
    case action.add_team_success:
      return {
        ...state,
        ...payload
      }

    // 修改小组
    case action.edit_team_loading:
      return {
        ...state,

        edit_team_msg: '',
        edit_team_loading: true,
      }
    case action.edit_team_loaded:
      return {
        ...state,

        edit_team_loading: false,
      }
    case action.edit_team_fail:
      return {
        ...state,

        edit_team_msg: payload,
      }
    case action.edit_team_success:
      return {
        ...state,
        ...payload
      }

    // 删除小组
    case action.remove_team_loading:
      return {
        ...state,

        remove_team_msg: '',
        remove_team_loading: true,
      }
    case action.remove_team_loaded:
      return {
        ...state,

        remove_team_loading: false,
      }
    case action.remove_team_fail:
      return {
        ...state,

        remove_team_msg: payload,
      }
    case action.remove_team_success:
      return {
        ...state,
        ...payload
      }

    // 获取小组任务列表
    case action.get_task_data_loading:
      return {
        ...state,
        ...payload
      }
    case action.get_task_data_loaded:
      return {
        ...state,
        ...payload
      }
    case action.get_task_data_fail:
      return {
        ...state,
        ...payload
      }
    case action.get_task_data_success:
      return {
        ...state,
        ...payload
      }

    // 获取小组成员列表
    case action.get_member_data_loading:
      return {
        ...state,
        ...payload
      }
    case action.get_member_data_loaded:
      return {
        ...state,
        ...payload
      }
    case action.get_member_data_fail:
      return {
        ...state,
        ...payload
      }
    case action.get_member_data_success:
      return {
        ...state,
        ...payload
      }

    default:
      return state
  }
}
/* end reducer */
