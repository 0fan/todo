import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Input, Text, Textarea } from '@tarojs/components'

import cs from 'classnames'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card/taskCard'
import Btn from '../../component/button'
import FormControl from '../../component/form/formControl'
import DatePicker from '../../component/datePicker'

import { changeCurrentTeam } from '../../model/user'
import { getTeam } from '../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  changeCurrentTeam: (...rest) => dispatch(changeCurrentTeam(...rest)),
  getTeam: (...rest) => dispatch(getTeam(...rest)),
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

    endTime: '',

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
      member,
      endTime
    } = this.state

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

  handleClick = (v, i, e) => {
    console.log(v, i)
  }

  render () {
    const {
      visibleAdd,

      memberList,
      member
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

                onClick = { this.handleClick.bind(this, v, i) }

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
          />

          <FormControl label = '参与者'>
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
          </FormControl>

          <DatePicker
            label = '任务截止日期'

            value = { endTime }
            onChange = { this.handleChange.bind(this, 'endTime') }
          />

          <Btn>完成</Btn>
        </View>
      </Layout>
    )
  }
}
