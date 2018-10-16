import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../../../component/layout'
import Panel from '../../../../component/panel'
import Btn from '../../../../component/button'
import Card from '../../../../component/card/memberCard'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '小组详情',
    backgroundColor: '#eee',
    enablePullDownRefresh: true,
  }

  render () {
    return (
      <Layout padding = { [0, 60, 60] } flex>
        <Layout>
          <Panel title = '壹房通v2.0版本' collapse />
          <Card avatar = 'a' nickName = '产品阿骏' isCreator />
          <Card avatar = 'a' nickName = '设计小松' />
          <Card avatar = 'a' nickName = '曾老板' />
        </Layout>

        <Btn>退出该小组</Btn>
      </Layout>
    )
  }
}
