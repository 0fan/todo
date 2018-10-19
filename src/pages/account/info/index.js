import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Input } from '@tarojs/components'

import _ from 'lodash'

import { showToast, showLoading, hideLoading, showModal } from '../../../util/wx'

import Layout from '../../../component/layout'
import Panel from '../../../component/panel'
import Btn from '../../../component/button'
import SwitchTeamModal from '../../../component/switchTeamModal'

import { editTeam } from '../../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  editTeam: (...rest) => dispatch(editTeam(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的信息',
  }

  state = {
    visible: false,
    // 当前小组id
    // 之前是全局的小组id
    // 想了下,这里应该是只是单独修改小组昵称,不应该切换当前小组
    // 所以做成局域变量
    currentTeamId: '',
    value: ''
  }

  componentWillMount () {
    const {
      team: {
        data
      }
    } = this.props

    const listData = Object.keys(data)

    if (listData.length) {
      const { groupNickName } = data[listData[0]]

      this.originData = {
        value: groupNickName
      }

      this.setState({
        currentTeamId: listData[0],
        value: groupNickName
      })
    }
  }

  handleShowSwitch = () => {
    this.setState({
      visible: true
    })
  }

  handleHideSwitch = () => {
    this.setState({
      visible: false
    })
  }

  handleSwitchTeam = v => {
    const {
      currentTeamId
    } = this.state

    if (currentTeamId === v) {
      this.setState({
        visible: false
      })

      return
    }

    const {
      team: {
        data
      }
    } = this.props

    const currentTeam = data[v]
    const { groupNickName } = currentTeam

    this.originData = {
      value: groupNickName
    }

    this.setState({
      currentTeamId: v,
      visible: false,
      value: groupNickName
    })
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e.target.value
    })
  }

  handleSubmit = async () => {
    const {
      value,
      currentTeamId
    } = this.state

    const error = []

    if (!value) {
      error.push('请输入成员昵称')
    }

    if (_.isEqual(this.originData, { value: this.state.value })) {
      error.push('数据未改变')
    }

    if (error.length) {
      showToast({ title: error[0] })

      return
    }

    showLoading({ title: '修改中' })

    const [err, res] = await this.props.editTeam({
      groupId: currentTeamId,
      nickeName: value
    })

    hideLoading()

    if (err) {
      showToast({ title: err })

      return
    }

    showToast({
      title: '修改成功',
      icon: 'success'
    })

    this.originData = {
      value
    }
  }

  render () {
    const {
      user: {
        nickName,
        avatarUrl,
      },
      team: {
        data
      }
    } = this.props

    const {
      visible,
      currentTeamId,
      value
    } = this.state

    const currentTeam = data[currentTeamId]

    if (!currentTeam) {
      return null
    }

    return (
      <Layout padding = { [0, 60, 60] }>
        <Panel
          avatar = { avatarUrl }
          title = { nickName }

          type = 'center'
        />

        <View className = 'form-group'>
          <View className = 'form-group-header'>成员该如何称呼你</View>
          <View className = 'form-group-body'>
            <View className = 'form-group-control'>
              <Input
                placeholder ='请输入小组昵称'
                value = { value }
                onInput = { this.handleChange.bind(this, 'value') }
                maxLength = { 10 }
              />
            </View>
            <View className = 'form-group-after' onClick = { this.handleShowSwitch }>{ currentTeam.groupName }</View>
          </View>
        </View>

        <Btn onClick = { this.handleSubmit }>保存</Btn>

        <SwitchTeamModal
          visible = { visible }
          value = { currentTeamId }
          data = { Object.keys(data).map(k => data[k]) }
          onOk = { this.handleSwitchTeam }
          onClose = { this.handleHideSwitch }
        />
      </Layout>
    )
  }
}
