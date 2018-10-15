import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Layout from '../../component/layout'
import Btn from '../../component/button'

import './index.less'

export default class Page extends Component {
  handleGetUserInfo = (e) => {
    const {
      detail: {
        userInfo
      }
    } = e

    console.log(userInfo)
  }

  render () {
    return (
      <Layout padding = { [0, 112] }>
        <View className = 'brand' />
        <View className = 'title'>
          <Text>使用凸度前\n请先获取微信授权</Text>
        </View>
        <Btn
          openType = 'getUserInfo'
          onGetUserInfo = { this.handleGetUserInfo }
        >
          获取微信授权
        </Btn>
      </Layout>
    )
  }
}
