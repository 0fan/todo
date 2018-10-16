import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../../component/layout'
import Panel from '../../../component/panel'
import Card from '../../../component/card/teamCard'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的小组',
    backgroundColor: '#eee',
    enablePullDownRefresh: true,
  }

  render () {
    return (
      <Layout padding = { [0, 0, 48] }>
        <Panel title = '林凡'>
          每人最多存在于3个小组
        </Panel>

        <Layout padding = { [14, 36, 0] }>
          <Card type = 'life' title = '壹房通v2.0版本' member = { 4 } isCurrent />
          <Card type = 'tour' title = '欧洲七日深度游' member = { 2 } />
          <Card type = 'work' title = '2018心愿清单' member = { 2 } />
          <Card isAdd />
        </Layout>
      </Layout>
    )
  }
}
