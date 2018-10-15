import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Avatar from '../avatar'

import './index.less'

export default class App extends Component {
  render () {
    const {
      avatar
    } = this.props

    return (
      <View className = 'panel'>
        <Avatar src = { avatar } />
      </View>
    )
  }
}
