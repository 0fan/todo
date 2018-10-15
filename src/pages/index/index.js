import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'

import './index.less'

export default class Page extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className = 'index'></View>
    )
  }
}
