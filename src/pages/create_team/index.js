import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'

import cs from 'classnames'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '创建小组',
  }

  state = {
    groupName: '',
    creatorName: '',

    type: [],

    typeList: [
      {
        code: 'work',
        label: '工作'
      },
      {
        code: 'tour',
        label: '旅游'
      },
      {
        code: 'life',
        label: '生活'
      },
    ]
  }

  handleChange = (type, e) => {
    this.setState({
      [type]: e.detail.value
    })
  }

  handleSelectType = (v, i, e) => {
    const { type } = this.state

    if (!type.includes(v.code)) {
      this.setState({
        type: [v.code]
      })
    }
  }

  handleSubmit = e => {}

  render () {
    const {
      groupName,
      creatorName,
      type,
      typeList
    } = this.state

    return (
      <Layout padding = { [0, 60, 60] }>
        <Layout padding = { [0, 0, 60] }>
          <Panel title = '你好 Jason\n请完善以下内容' avatar = 'a' collapse />

          <View className = 'form-group'>
            <Input placeholder = '独一无二的小组名称' value = { groupName } onInput = { this.handleChange.bind(this, 'groupName') } />
          </View>

          <View className = 'form-group'>
            <Input placeholder = '成员如何该称呼你' value = { creatorName } onInput = { this.handleChange.bind(this, 'creatorName') } />
          </View>

          <View className = 'form-type'>
            <View className = 'form-type-title'>选定一个小组类型</View>
            <View className = 'form-type-content'>
              <View className = 'type-wrap'>
                {
                  typeList.map((v, i) => (
                    <View
                      className = {
                        cs('type-checkbox', {
                          [`type-checkbox-${ v.code }`]: v.code,
                          ['type-checkbox-checked']: type.includes(v.code)
                        })
                      }
                      key = { i }
                      onClick = { this.handleSelectType.bind(this, v, i) }
                    >
                      { v.label }
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
