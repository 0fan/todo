import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Input, Text, Textarea } from '@tarojs/components'

import moment from 'moment'
import cs from 'classnames'
import qs from 'qs'

import { showToast, showLoading, hideLoading, showModal } from '../../util/wx'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card/taskCard'
import Btn from '../../component/button'
import FormControl from '../../component/form/formControl'
import DatePicker from '../../component/datePicker'

import { changeCurrentTeam } from '../../model/user'
import { getTeam, addTeamTask } from '../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  changeCurrentTeam: (...rest) => dispatch(changeCurrentTeam(...rest)),
  getTeam: (...rest) => dispatch(getTeam(...rest)),
  addTeamTask: (...rest) => dispatch(addTeamTask(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '小组任务',
    navigationBarBackgroundColor: '#257AFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#257AFF',
    enablePullDownRefresh: true,
  }

  state = {
    visibleAdd: false,

    taskCentent: '',
    members: [],
    endTime: moment().add(3, 'd').format('YYYY-MM-DD HH:mm'),
  }

  handleShowAdd = () => {
    this.setState({ visibleAdd: true })
  }

  handleHideAdd = () => {
    this.setState({ visibleAdd: false })
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e.target.value
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

  handleSubmit = async () => {
    const {
      user: {
        id,
        currentTeamId,
      },
      team: {
        data
      },
      addTeamTask
    } = this.props

    const {
      taskCentent,
      members,
      endTime,
    } = this.state

    const currentTeam = data[currentTeamId]

    // 检验
    const error = []

    if (!currentTeam) {
      error.push('没有当前小组数据')
    }

    if (!taskCentent) {
      error.push('请输入任务内容')
    }

    if (!endTime)  {
      error.push('请选择任务时间')
    }

    if (error.length) {
      showToast({
        title: error[0]
      })

      return
    }
    // 结束 检验

    showLoading({
      title: '创建任务中...',
    })

    const [err, res] = await addTeamTask({
      creator: id,
      groupId: currentTeamId,

      taskCentent,
      endTime,
      members: [currentTeam.creator].concat(members).join(',')
    })

    hideLoading()

    if (err) {
      showToast({
        title: err,
      })

      return
    }

    // 重置表单数据
    this.setState({
      // 重置表单数据
      taskCentent: '',
      endTime: moment().add(3, 'd').format('YYYY-MM-DD HH:mm'),
      members: [],
      visibleAdd: false
    })

    const sure = await showModal({
      content: '你已经成功发布了一个任务\n现在你可以选择',
      cancelText: '关闭',
      confirmText: '继续发布'
    })

    if (sure) {
      this.setState({
        visibleAdd: true
      })
    }
  }

  render () {
    const {
      visibleAdd,


      // form
      endTime,
      members,
      taskCentent
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

    return (
      <Layout>
        <Panel
          title = { currentTeam.groupName }
          extra = { `${ currentTeam.memberCount }位成员` }

          finishCount = { currentTeam.finishCount }
          ingCount = { currentTeam.ingCount }
          postponeCount = { currentTeam.postponeCount }

          dark
          visibleSwitch = { Object.keys(data).length > 1 }
        >
          <View className = 'invite-btn' />
        </Panel>

        <Layout padding = { [100, 32, 64] }>
          <Sort>
            <View className = 'release-btn' onClick = { this.handleShowAdd } />
          </Sort>

          {
            currentTeam.task.map((v, i) => (
              <Card
                title = { v.taskCentent }
                project = { v.userGroup.groupName }

                status = { v.status }

                finishCountDays = { v.finishCountDays }
                postponeCountDays = { v.postponeCountDays }
                surplusCountDays = { v.surplusCountDays }

                to = { `/pages/task_detail/index?id=${ v.id }` }

                key = { i }
              />
            ))
          }
        </Layout>

        <View className = { cs('modal-mask', { 'modal-mask-visible': visibleAdd }) } onClick = { this.handleHideAdd } />
        <View className = { cs('modal-dialog', { 'modal-dialog-visible': visibleAdd }) }>
          <View className = 'modal-dialog-close' onClick = { this.handleHideAdd } />

          <FormControl
            label = '需要做什么'
            type = 'textarea'
            placeholder = '150字以内'
            maxlength = { 150 }

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
          />

          <Btn onClick = { this.handleSubmit }>完成</Btn>
        </View>
      </Layout>
    )
  }
}
