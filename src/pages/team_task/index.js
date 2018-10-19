import Taro, { Component, navigateTo } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Input, Text, Textarea } from '@tarojs/components'

import _ from 'lodash'
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
import SwitchTeamModal from '../../component/switchTeamModal'
import Empty from '../../component/empty'
import Loading from '../../component/loading'
import Fail from '../../component/fail'

import { pipeTask } from '../../util/pipeTask'

import { changeCurrentTeam } from '../../model/user'
import { getTeam, addTeamTask, removeTeamTask } from '../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  changeCurrentTeam: (...rest) => dispatch(changeCurrentTeam(...rest)),
  getTeam: (...rest) => dispatch(getTeam(...rest)),
  addTeamTask: (...rest) => dispatch(addTeamTask(...rest)),
  removeTeamTask: (...rest) => dispatch(removeTeamTask(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '小组任务',
    navigationBarBackgroundColor: '#257AFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#257AFF',
    enablePullDownRefresh: true,

    // 第三方组件
    usingComponents: {
      'van-popup': '../../component/vant/popup/index',
    }
  }

  state = {
    visibleAdd: false,
    visibleSwitch: false,

    taskCentent: '',
    members: [],
    endTime: moment().add(3, 'd').format('YYYY-MM-DD HH:mm'),

    // 过滤类型
    filterType: {
      finish: 1,
      ing: 1,
      postpone: 1,
    },
    // 排序方式
    sortType: 0
  }

  // 下拉刷新
  onPullDownRefresh = async () => {
    const {
      team: {
        get_data_loading
      }
    } = this.props

    if (get_data_loading) {
      wx.stopPullDownRefresh() //停止下拉刷新

      return
    }

    wx.showNavigationBarLoading()

    const [err, res] = await this.getTeam()

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    if (!err) {
      showToast({ title: '刷新成功' })
    }
  }

  getTeam = async => {
    return this.props.getTeam({}, { isRefresh: true })
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

  /**
   * [微信分享事件]
   * @param  {[type]} res [description]
   * @return {void}
   */
  onShareAppMessage = res => {
    const {
      user: {
        id,
        nickName,
        avatarUrl,
        currentTeamId,
      },
      team: {
        data,
      },
    } = this.props

    const currentTeam = data[currentTeamId]

    if (!currentTeam) {
      showToast({
        title: '没有获取到小组信息',
      })

      return
    }

    // 是否是小组创建者
    const isTeamCreator = currentTeam.creator === id

    if (!isTeamCreator) {
      return {
        title: '凸度',
        path: '/pages/my_task/index'
      }
    }

    // Taro.navigateTo({
    //   url: `/pages/invite/index?${ qs.stringify({
    //     // 发布者的名称
    //     nickName,
    //     // 发布者的头像
    //     avatarUrl,
    //     // 当前小组信息
    //     ...currentTeam
    //   }) }`
    // })

    return {
      title: `${ nickName }邀请你加入${ currentTeam.groupName }`,
      path: `/pages/invite/index?${ qs.stringify({
        // 发布者的名称
        nickName,
        // 发布者的头像
        avatarUrl,
        groupId: currentTeamId,
        // 当前小组信息
        ...currentTeam
      }) }`
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

    if (!members.length) {
      error.push('至少选择一个成员')
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

  handleShowSwitch = () => {
    this.setState({
      visibleSwitch: true
    })
  }

  handleHideSwitch = () => {
    this.setState({
      visibleSwitch: false
    })
  }

  handleSwitchTeam = async v => {
    const {
      currentTeamId
    } = this.state

    if (currentTeamId === v) {
      this.setState({
        visibleSwitch: false
      })

      return
    }

    showLoading({ title: '切换小组中' })

    const [err, res] = await this.props.changeCurrentTeam(v)

    hideLoading()

    this.setState({
      visibleSwitch: false
    })
  }

  handleExtraClick = () => {
    navigateTo({
      url: `/pages/account/my_team/team_detail/index?id=${ this.props.user.currentTeamId }`
    })
  }

  handleSort = () => {
    this.setState(prevState => ({
      sortType: (prevState.sortType + 1) % 3
    }))
  }

  handleFinishCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       finish: prevState.filterType.finish === 0 ? 1 : 0
      }
    }))
  }

  handleIngCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       ing: prevState.filterType.ing === 0 ? 1 : 0
      }
    }))
  }

  handlePostponeCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       postpone: prevState.filterType.postpone === 0 ? 1 : 0
      }
    }))
  }

  // 长按删除
  handleLongPress = async (v, i, e) => {
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
      taskId: v.id
    })

    if (err) {
      showToast({
        title: err
      })

      return
    }

    showToast({
      title: '删除成功',
      icon: 'success'
    })
  }

  render () {
    const {
      visibleAdd,
      visibleSwitch,

      // form
      endTime,
      members,
      taskCentent,

      filterType,
      sortType
    } = this.state

    const {
      user: {
        id,
        currentTeamId,
      },
      team: {
        data,
        get_data_loading,
        get_data_init,
        get_data_msg
      }
    } = this.props

    const currentTeam = data[currentTeamId]

    if (!currentTeam) {
      return null
    }

    const _data = pipeTask(currentTeam.task, filterType, sortType)

    // 是否是小组创建者
    const isTeamCreator = currentTeam.creator === id
    const listTeam = Object.keys(data).map(k => data[k])

    return (
      <Layout>
        <Panel
          title = { currentTeam.groupName }
          extra = { `${ currentTeam.memberCount }位成员` }
          onExtraClick = { this.handleExtraClick }

          filterType = { filterType }

          finishCount = { currentTeam.finishCount }
          ingCount = { currentTeam.ingCount }
          postponeCount = { currentTeam.postponeCount }

          dark
          visibleSwitch = { listTeam.length > 1 }
          onSwitch = { this.handleShowSwitch }

          onFinishCountClick = { this.handleFinishCountClick }
          onIngCountClick = { this.handleIngCountClick }
          onPostponeCountClick = { this.handlePostponeCountClick }
        >
          {
            isTeamCreator ?
              <Btn className = 'invite-btn' openType = 'share'>邀请</Btn> :
              ''
          }
        </Panel>

        {
          get_data_loading ?
            <Loading /> :
            get_data_msg ?
              <Fail><Text className = 'a' onClick = { this.getTeam }>重试</Text></Fail> :
              !_data.length ?
                <Layout padding = { [100, 32, 64] }>
                  <Sort type = { sortType } onClick = { this.handleSort }>
                    <Btn className = 'release-btn' onClick = { this.handleShowAdd }>
                      发布任务
                    </Btn>
                  </Sort>
                  <Empty />
                </Layout> :
                <Layout padding = { [100, 32, 64] }>
                  <Sort type = { sortType } onClick = { this.handleSort }>
                    <Btn className = 'release-btn' onClick = { this.handleShowAdd }>
                      发布任务
                    </Btn>
                  </Sort>
                  {
                    _data.map((v, i) => (
                      <Card
                        title = { v.taskCentent }
                        project = { v.userGroup.groupName }

                        status = { v.status }

                        finishCountDays = { v.finishCountDays }
                        postponeCountDays = { v.postponeCountDays }
                        surplusCountDays = { v.surplusCountDays }

                        to = { `/pages/task_detail/index?id=${ v.id }` }
                        onLongPress = { this.handleLongPress.bind(this, v, i) }

                        key = { i }
                      />
                    ))
                  }
                </Layout>
        }

        <van-popup
          show = { visibleAdd }
          onclose = { this.handleHideAdd }
          position = 'bottom'
          duration = { 200 }
        >
          <View className = 'modal-dialog'>
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
                    {
                      currentTeam.member.map((v, i) => (
                        <View
                          className = {
                            cs('member-checkbox', {
                              ['member-checkbox-checked']: members.includes(v.id)
                            })
                          }
                          key = { i }
                          onClick = { this.handleSelectMember.bind(this, v, i) }
                        >
                          { v.memberName ? v.memberName : v.nickName }
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
        </van-popup>

        <SwitchTeamModal
          visible = { visibleSwitch }
          value = { currentTeamId }
          data = { listTeam }
          onOk = { this.handleSwitchTeam }
          onClose = { this.handleHideSwitch }
        />
      </Layout>
    )
  }
}
