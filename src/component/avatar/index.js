import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import defaultAvatar from '../../asset/img/default_avatar.png'

import './index.less'

export default class App extends Component {
  state = {
    isError: false
  }

  handlerError = e => {
    this.setState({ isError: true })
  }

  render () {
    const {
      src = '../../asset/img/default_avatar.png',
      size
    } = this.props

    const {
      isError
    } = this.state

    let styleString = {}

    if (size) {
      styleString.width = pxTransform(size)
      styleString.height = pxTransform(size)
      styleString.borderRadius = pxTransform(size / 2)
    }

    return (
      <View className = 'avatar' style = { styleString }>
        <Image src = { isError || !src ? defaultAvatar : src } onError = { this.handlerError } />
      </View>
    )
  }
}
