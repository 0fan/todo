import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import List from '../../component/list'
import Item from '../../component/list/item'
import Brand from '../../component/brand'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '个人中心',
  }

  render () {
    return (
      <Layout padding = { [0, 28, 112] }>
        <Panel
          title = '林凡'
          extra = '已加入1个小组'
          avatar = 'd'
        />
        <List>
          <Item title = '我的信息' icon = 'i' to = '/' />
          <Item title = '我的小组' icon = 'team' to = '/' />
        </List>
        <Brand />
      </Layout>
    )
  }
}
