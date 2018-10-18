import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import _ from 'lodash'

import './index.less'

export default class App extends Component {
  config = {
    usingComponents: {
    }
  }

  render () {
    const {
      title = '想好要做什么了吗？',
    } = this.props

    return (
      <View className = 'empty'>
        <View className = 'empty-content'>
          <View className = 'legend' />
          <View className = 'title'><Text>{ title }</Text></View>
        </View>
      </View>
    )
  }
}
