import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Textarea } from '@tarojs/components'

import cs from 'classnames'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card'
import Btn from '../../component/button'

import './index.less'

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

    member: [],
    memberList: [
      {
        id: '1',
        nickName: '林凡'
      },
      {
        id: '2',
        nickName: '潇潇'
      },
      {
        id: '3',
        nickName: '刘看山'
      },
      {
        id: '4',
        nickName: '林凡'
      },
      {
        id: '5',
        nickName: '潇潇'
      },
      {
        id: '6',
        nickName: '刘看山'
      }
    ]
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleShowAdd = () => {
    this.setState({ visibleAdd: true })
  }

  handleHideAdd = () => {
    this.setState({ visibleAdd: false })
  }

  handleSelectMember = (v, i, e) => {
    const { member } = this.state

    if (member.includes(v.id)) {
      this.setState({
        member: member.filter(id => id !== v.id)
      })
    } else {
      this.setState({
        member: member.concat(v.id)
      })
    }
  }

  render () {
    const {
      visibleAdd,

      memberList,
      member
    } = this.state

    return (
      <Layout>
        <Panel
          title = '你好 林凡'
          extra = '1位成员'

          finishCount = { 0 }
          ingCount = { 0 }
          postponeCount = { 0 }

          dark
        >

          <View className = 'invite-btn' />
        </Panel>
        <Layout padding = { [100, 32, 64] }>
          <Sort>
            <View className = 'release-btn' onClick = { this.handleShowAdd } />
          </Sort>
          <Card
            title = '产品版本迭代计划书'
            project = '奔驰采购计划'
            status = '0'
            postponeCountDays = '2'
          />
          <Card
            title = '产品版本迭代计划书'
            project = '奔驰采购计划'
            status = '2'
            surplusCountDays = '2'
          />
          <Card
            title = '产品版本迭代计划书'
            project = '奔驰采购计划'
            status = '1'
            finishCountDays = '2'
          />
        </Layout>
        <View className = { cs('modal-mask', { 'modal-mask-visible': visibleAdd }) } onClick = { this.handleHideAdd } />
        <View className = { cs('modal-dialog', { 'modal-dialog-visible': visibleAdd }) }>
          <View className = 'modal-dialog-close' onClick = { this.handleHideAdd } />

          <View className = 'form-group'>
            <View className = 'form-group-label'>需要做什么</View>
            <View className = 'form-group-content'>
              <Textarea
                placeholder = '150字以内'
                maxlength = { 150 }
              />
            </View>
          </View>

          <View className = 'form-group'>
            <View className = 'form-group-label'>参与者</View>
            <View className = 'form-group-content'>
              <View className = 'member-wrap'>
                {
                  memberList.map((v, i) => (
                    <View
                      className = {
                        cs('member-checkbox', {
                          ['member-checkbox-checked']: member.includes(v.id)
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
            </View>
          </View>

          <View className = 'form-group'>
            <View className = 'form-group-label'>任务截止日期</View>
            <View className = 'form-group-content'>
            </View>
          </View>

          <Btn>完成</Btn>
        </View>
      </Layout>
    )
  }
}
