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

import { editTeamTask, removeTeamTask } from '../../model/team/method'

import { url, api } from '../../config/api'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  editTeamTask: (...rest) => dispatch(editTeamTask(...rest)),
  removeTeamTask: (...rest) => dispatch(removeTeamTask(...rest)),
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

      taskCentent: '',
      members: [],
      endTime: ''
    }
  }

  componentWillMount () {
    const {
      id
    } = this.$router.params

    const {
      user: {
        currentTeamId,
      },
      team: {
        data
      }
    } = this.props

    const currentTeam = data[currentTeamId]

    if (!currentTeam) {
      this.getTaskDetail(id)

      return
    }

    const task = currentTeam.task.find(v => String(v.id) === id)

    if (!task) {
      this.getTaskDetail(id)

      return
    }

    const {
      taskCentent,
      members,
      endTime
    } = task

    const _endTime = moment(Number(endTime)).format('YYYY-MM-DD HH:mm')

    // 保存原数据提交的时候做比较,如果一样则不提交
    this.originData = {
      taskCentent,
      members,
      endTime: _endTime
    }

    this.setState({
      task,

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
    const _members = _.isString(members) ? members.split(',') : [creator]

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
      title: '修改成功,该任务已完成',
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

      taskCentent,
      members,
      endTime,
    } = this.state

    const {
      user: {
        currentTeamId,
      },
      team: {
        data
      }
    } = this.props

    const currentTeam = data[currentTeamId]

    if (!currentTeam) {
      return null
    }

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

    return (
      <Layout padding = { [0, 60, 60] }>
        <FormControl
          label = '需要做什么'
          type = 'textarea'
          placeholder = '150字以内'
          maxlength = { 150 }
          disabled = { !isEdit }

          value = { taskCentent }
          onChange = { this.handleChange.bind(this, 'taskCentent') }
        />

        <FormControl label = '参与者'>
          {
            currentTeam.get_member_data_loading ?
              <View>加载中</View> :
              <View className = 'member-wrap'>
                <View className = { cs('member-checkbox', 'member-checkbox-checked') }>
                  { currentTeam.creatorName }
                </View>
                {
                  // 过滤到创建者的id
                  // 因为创建者必须包含创建者
                  currentTeam.member.filter(v => v.id !== currentTeam.creator).map((v, i) => (
                    <View
                      className = {
                        cs('member-checkbox', {
                          ['member-checkbox-checked']: members.includes(v.id)
                        })
                      }
                      key = { i }
                      onClick = { this.handleSelectMember.bind(this, v, i) }
                    >
                      { v.nickName }
                    </View>
                  ))
                }
              </View>
          }
        </FormControl>

        <DatePicker
          label = '任务截止日期'

          value = { endTime }
          onChange = { this.handleChange.bind(this, 'endTime') }
          disabled = { !isEdit }
        />

        {
          task.status == '1' ?
            <View className = 'action'>
              <Btn type = 'default' plain onClick = { this.handleDelete }>删除任务</Btn>
            </View> :
            renderAction
        }
      </Layout>
    )
  }
}
