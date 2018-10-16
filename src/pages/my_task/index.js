import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card/taskCard'

import './index.less'

export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的任务',
    navigationBarBackgroundColor: '#257AFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#257AFF',
    enablePullDownRefresh: true,
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <Layout>
        <Panel
          title = '你好 林凡'
          extra = '今天是 2018年8月21日 祝一切顺利 ！'
          avatar = 'd'

          finishCount = { 0 }
          ingCount = { 0 }
          postponeCount = { 0 }

          dark
        />
        <Layout padding = { [100, 32, 64] }>
          <Sort />
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
      </Layout>
    )
  }
}
