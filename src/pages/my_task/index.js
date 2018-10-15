import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../component/layout'
import Panel from '../../component/panel'

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
        <Panel></Panel>
      </Layout>
    )
  }
}
