import Taro, { Component, navigateBack } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Textarea, Input } from '@tarojs/components'

import _ from 'lodash'
import cs from 'classnames'
import moment from 'moment'

import ajax from '../../util/ajax'
import { showToast, showModal, showLoading, hideLoading } from '../../util/wx'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'
import FormControl from '../../component/form/formControl'
import DatePicker from '../../component/datePicker'

import { editTeamTask, removeTeamTask, getTeamMember } from '../../model/team/method'

import { url, api } from '../../config/api'

import './index.less'

@connect(state => ({
  user: state.user,
  task: state.task,
  team: state.team,
}), dispatch => ({
  editTeamTask: (...rest) => dispatch(editTeamTask(...rest)),
  removeTeamTask: (...rest) => dispatch(removeTeamTask(...rest)),
  getTeamMember: (...rest) => dispatch(getTeamMember(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '任务详情',
  }

  constructor (props) {
    super(props)

    this.state = {
      isEdit: false,

      task: null,
      // 所有小组成员
      member: [],

      taskCentent: '',
      // 用户选择的小组成员
      members: [],
      endTime: ''
    }
  }

  componentWillMount () {
    const {
      id
    } = this.$router.params

    const {
      task: {
        data
      },
      team: {
        data: teamData
      }
    } = this.props

    const task = data.find(v => String(v.id) === id)

    // 如果个人任务列表没有这条数据则请求服务器
    if (!task) {
      this.getTaskDetail(id)

      return
    }

    const {
      // 小组id
      userGroupId,

      taskCentent,
      member: members,
      endTime
    } = task

    const team = teamData[userGroupId]

    if (!team || !team.get_member_data_init) {
      this.getTeamMember(userGroupId)
    }

    const _endTime = moment(Number(endTime)).format('YYYY-MM-DD HH:mm')

    // 保存原数据提交的时候做比较,如果一样则不提交
    this.originData = {
      taskCentent,
      members,
      endTime: _endTime
    }

    this.setState({
      task,
      member: team.member,

      taskCentent,
      members,
      endTime: _endTime,
    })
  }

  // 获取小组详情
  // 个人任务过来,可能点击的任务不是当前小组,所以需要单独获取小组任务
  // 获取成功后还需要获取小组成员
  getTaskDetail = async (taskId) => {
    showLoading({
      title: '获取小组详情中',
    })

    const [err, res] = await ajax(url.server + api.task.detail, {
      taskId
    })

    hideLoading()

    if (err) {
      showToast({
        title: err
      })

      return
    }

    const {
      creator,

      taskCentent,
      member: members,
      endTime
    } = res

    const _endTime = moment(Number(endTime)).format('YYYY-MM-DD HH:mm')
    const _members = _.isString(members) ? members.split(',') : []

    // 保存原数据提交的时候做比较,如果一样则不提交
    this.originData = {
      taskCentent,
      members: _members,
      endTime: _endTime
    }

    this.setState({
      task: res,

      taskCentent: taskCentent,
      members: _members,
      endTime: _endTime
    })
  }

  // 获取小组成员
  getTeamMember = async (teamId) => {
    const [err, res] = await this.props.getTeamMember({}, { teamId })

    if (res) {
      this.setState({
        member: res.userinfos
      })
    }
  }

  handleSelectMember = (v, i, e) => {
    const {
      members,
      endTime
    } = this.state

    if (members.includes(v.id)) {
      this.setState({
        members: members.filter(id => id !== v.id)
      })
    } else {
      this.setState({
        members: members.concat(v.id)
      })
    }
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e.target.value
    })
  }

  // 切换为编辑状态
  handleEdit = () => {
    this.setState({ isEdit: true })
  }

  // 删除任务
  handleDelete = async () => {
    const {
      task
    } = this.state

    const {
      removeTeamTask
    } = this.props

    const sure = await showModal({ content: '确认删除此任务吗?' })

    if (!sure) {
      return
    }

    showLoading({
      title: '删除中',
    })

    const [err, res] = await removeTeamTask({
      taskId: task.id
    })

    hideLoading()

    if (err) {
      showToast({
        title: err
      })

      return
    }

    await showToast({
      title: '删除成功',
      icon: 'success'
    })

    navigateBack()
  }

  // 完成任务
  handleComplete = async () => {
    const {
      task,

      taskCentent,
      members,
      endTime,
    } = this.state

    const {
      editTeamTask
    } = this.props

    const sure = await showModal({ content: '确认完成此任务吗?' })

    if (!sure) {
      return
    }

    showLoading({
      title: '修改中',
    })

    const [err, res] = await editTeamTask({
      taskId: task.id,
      taskCentent,
      members: members.join(','),
      endTime,
      status: '1'
    })

    hideLoading()

    if (err) {
      showToast({
        title: err,
      })

      return
    }

    this.setState(prevState => ({
      task: {
        ...prevState.task,
        status: '1'
      }
    }))

    await showToast({
      title: '修改成功',
      icon: 'success'
    })

    navigateBack()
  }

  // 提交修改
  handleSubmit = async () => {
    const {
      task,

      taskCentent,
      members,
      endTime,
    } = this.state

    const {
      editTeamTask
    } = this.props

    const error = []

    if (_.isEqual(this.originData, { taskCentent, members, endTime })) {
      error.push('数据未改变')
    }

    if (!taskCentent) {
      error.push('请输入任务内容')
    }

    if (!members.length) {
      error.push('至少选择一个成员')
    }

    if (!endTime)  {
      error.push('请选择任务时间')
    }

    if (error.length) {
      showToast({ title: error[0] })

      return
    }

    showLoading({
      title: '修改中',
    })

    const [err, res] = await editTeamTask({
      taskId: task.id,
      taskCentent,
      members: members.join(','),
      endTime,
      status: task.status
    })

    hideLoading()

    if (err) {
      showToast({
        title: err,
      })

      return
    }

    await showToast({
      title: '修改成功',
      icon: 'success'
    })

    // 修改成功后返回到上一级页面
    navigateBack()
  }

  render () {
    const {
      isEdit,

      task,
      member,

      taskCentent,
      members,
      endTime,
    } = this.state

    const {
      team: {
        data
      },
      user: {
        id
      }
    } = this.props

    // 是否是小组创建者
    const isTeamCreator = task.userGroup.creator === id
    // 是否是任务创建者
    const isTaskCreator = task.creator === id

    if (!task) {
      return null
    }

    let renderAction = null


    // 任务如果已完成不可编辑
    if (!isEdit) {
      renderAction = (
        <View className = 'action'>
          <Btn plain onClick = { this.handleEdit }>编辑任务</Btn>
          <Btn onClick = { this.handleComplete }>完成任务</Btn>
        </View>
      )
    } else {
      renderAction = (
        <View className = 'action'>
          <Btn type = 'default' plain onClick = { this.handleDelete }>删除任务</Btn>
          <Btn onClick = { this.handleSubmit }>提交</Btn>
        </View>
      )
    }

    let extra = ''
    let extraClass = ''

    if (!isEdit) {
      if (task.status === '1') {
        extra = `完成${ task.finishCountDays }天`
        extraClass = cs('status', 'status-success')
      }
      if (task.status === '2') {
        extra = `剩余${ task.surplusCountDays }天`
        extraClass = cs('status', 'status-progress')
      }
      if (task.status === '0') {
        extra = `延期${ task.postponeCountDays }天`
        extraClass = cs('status', 'status-fail')
      }
    }

    return (
      <View className = 'page'>
        <View className = 'page-content'>
          <FormControl
            label = '需要做什么'
            type = 'textarea'
            extra = { extra }
            extraClass = { extraClass }
            placeholder = '150字以内'
            maxlength = { 150 }
            disabled = { !isEdit }

            value = { taskCentent }
            onChange = { this.handleChange.bind(this, 'taskCentent') }
          />

          <FormControl label = '参与者'>
            <View className = 'member-wrap'>
              {
                // 过滤到创建者的id
                // 因为必须包含创建者
                (isEdit && isTeamCreator) || (isEdit && isTaskCreator) ?
                  member.map((v, i) => (
                    <View
                      className = {
                        cs('member-checkbox', {
                          ['member-checkbox-checked']: members.includes(v.id)
                        })
                      }
                      key = { i }
                      onClick = { this.handleSelectMember.bind(this, v, i) }
                    >
                      { v.memberName }
                    </View>
                  )) :
                  member.filter(v => members.includes(v.id)).map((v, i) => (
                    <View
                      className = {
                        cs('member-checkbox', {
                          ['member-checkbox-checked']: members.includes(v.id)
                        })
                      }
                      key = { i }
                    >
                      { v.memberName ? v.memberName : v.nickName }
                    </View>
                  ))
              }
            </View>
          </FormControl>

          <DatePicker
            label = '任务截止日期'

            value = { endTime }
            onChange = { this.handleChange.bind(this, 'endTime') }
            disabled = { !isEdit }
          />
        </View>

        {
          task.status == '1' ?
            <View className = 'action'>
              <Btn className = 'delete-btn' type = 'default' plain onClick = { this.handleDelete }>删除任务</Btn>
            </View> :
            renderAction
        }
      </View>
    )
  }
}
