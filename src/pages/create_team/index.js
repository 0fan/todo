import Taro, { Component, reLaunch, switchTab } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Input } from '@tarojs/components'

import cs from 'classnames'

import { showToast, showModal, showLoading, hideLoading } from '../../util/wx'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'

import { addTeam } from '../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  dict_team: state.dict_team,
}), dispatch => ({
  addTeam: (...rest) => dispatch(addTeam(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '创建小组',
  }

  state = {
    groupName: '',
    creatorName: '',

    type: []
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e.detail.value
    })
  }

  handleSelectType = (v, i, e) => {
    const { type } = this.state

    if (!type.includes(v.dicVal)) {
      this.setState({
        type: [v.dicVal]
      })
    }
  }

  handleSubmit = async e => {
    const {
      user: {
        id: userId
      },
      addTeam
    } = this.props

    const {
      groupName,
      creatorName,
      type
    } = this.state

    const error = []

    if (!groupName) {
      error.push('请输入小组名称')
    }

    if (!creatorName) {
      error.push('请输入你在小组的名称')
    }

    if (!type.length) {
      error.push('请选择小组类型')
    }

    if (error.length) {
      showToast({
        title: error[0],
      })

      return
    }

    showLoading({
      title: '创建小组中',
    })

    const [err, res] = await addTeam({
      userId,
      groupName,
      creatorName,
      groupType: type[0],
    })

    hideLoading()

    if (err) {
      showToast({
        title: err,
      })

      return
    }

    // 重置表单
    this.setState({
      groupName: '',
      creatorName: '',

      type: []
    })

    const sureDelete = await showModal({
      showCancel: false,
      content: '你已经成功创建了一个小组\n现在你可以选择',
      confirmText: '进入小组'
    })

    switchTab({
      url: '/pages/team_task/index'
    })
  }

  render () {
    const {
      groupName,
      creatorName,
      type
    } = this.state

    const {
      user: {
        nickName,
        avatarUrl,
      },
      dict_team: {
        data,
        loading,
        msg
      }
    } = this.props

    return (
      <Layout padding = { [0, 60, 60] }>
        <Layout padding = { [0, 0, 60] }>
          <Panel
            title = { `你好 ${ nickName }\n请完善以下内容` }
            avatar = { avatarUrl }
            collapse
          />

          <View className = 'form-group'>
            <Input
              placeholder = '独一无二的小组名称'
              value = { groupName }
              onInput = { this.handleChange.bind(this, 'groupName') }
              maxLength = { 10 }
            />
          </View>

          <View className = 'form-group'>
            <Input
              placeholder = '成员如何该称呼你'
              value = { creatorName }
              onInput = { this.handleChange.bind(this, 'creatorName') }
              maxLength = { 8 }
            />
          </View>

          <View className = 'form-type'>
            <View className = 'form-type-title'>选定一个小组类型</View>
            <View className = 'form-type-content'>
              <View className = 'type-wrap'>
                {
                  data.map((v, i) => (
                    <View
                      className = {
                        cs('type-checkbox', {
                          [`type-checkbox-${ v.dicVal }`]: v.dicVal,
                          ['type-checkbox-checked']: type.includes(v.dicVal)
                        })
                      }
                      key = { i }
                      onClick = { this.handleSelectType.bind(this, v, i) }
                    >
                      { v.dicName }
                    </View>
                  ))
                }
              </View>
            </View>
          </View>
        </Layout>

        <Btn onClick = { this.handleSubmit }>完成</Btn>
      </Layout>
    )
  }
}
