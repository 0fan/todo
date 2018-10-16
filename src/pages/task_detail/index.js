import Taro, { Component } from '@tarojs/taro'
import { View, Textarea, Input } from '@tarojs/components'

import cs from 'classnames'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'
import FormControl from '../../component/form/formControl'
import DatePicker from '../../component/datePicker'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '任务详情',
  }

  state = {
    endTime: 1539668760000,

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

  handleChange = (type, e) => {
    this.setState({
      [type]: e.target.value
    })
  }

  render () {
    const {
      endTime,

      memberList,
      member
    } = this.state

    return (
      <Layout padding = { [0, 60, 60] }>
        <FormControl
          label = '需要做什么'
          type = 'textarea'
          placeholder = '150字以内'
          maxlength = { 150 }
          disabled
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
          disabled
        />

        <View className = 'action'>
          <Btn plain>编辑任务</Btn>
          <Btn>完成任务</Btn>
        </View>
      </Layout>
    )
  }
}
