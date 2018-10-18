import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import cs from 'classnames'

import './index.less'

export default class App extends Component {
  config = {
    usingComponents: {
      'van-loading': '../vant/loading/index',
    }
  }

  render () {
    const {
      title = '请求数据中',
      type = 'spinner',
      size = '20px',
    } = this.props

    const classString = cs('loading', {})

    return (
      <View className = { classString }>
        <van-loading size = { size } />
        {
          title ?
            <View className = 'title'><Text>{ title }</Text></View> :
            null
        }
      </View>
    )
  }
}
