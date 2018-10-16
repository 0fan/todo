import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'
import Brand from '../../component/brand'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '凸度',
  }

  render () {
    return (
      <Layout padding = { [0, 60, 60] }>
        <Panel
          avatar = 'd'
          title = '林凡'

          type = 'left'
        />

        <View className = 'title'>
          <Text>壹房通v2.0版本小组</Text>
        </View>

        <Btn>加入该小组</Btn>
        <Brand />
      </Layout>
    )
  }
}
