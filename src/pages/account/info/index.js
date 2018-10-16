import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

import Layout from '../../../component/layout'
import Panel from '../../../component/panel'
import Btn from '../../../component/button'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的信息',
  }

  render () {
    return (
      <Layout padding = { [0, 60, 60] }>
        <Panel
          avatar = 'd'
          title = '林凡'

          type = 'center'
        />

        <View className = 'form-group'>
          <View className = 'form-group-header'>成员该如何称呼你</View>
          <View className = 'form-group-body'>
            <View className = 'form-group-control'>
              <Input
                placeholder ='请输入小组昵称'
              />
            </View>
            <View className = 'form-group-after'>壹房通v2.0版本</View>
          </View>
        </View>

        <Btn>保存</Btn>
      </Layout>
    )
  }
}
