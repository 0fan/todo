import Taro, { Component, navigateTo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import Avatar from '../../avatar'

import cs from 'classnames'

import './index.less'

export default class App extends Component {
  handleClick = e => {
    const {
      to,
      disabled
    } = this.props

    if (disabled) {
      return
    }

    if (to) {
      navigateTo({
        url: to
      })
    }

    this.props.onClick && this.props.onClick(e)
  }

  render () {
    const {
      avatar,
      nickName,
      // [Boolean] 是否是创建者
      isCreator
    } = this.props

    const classString = cs('card', {
      ['card-creator']: isCreator
    })

    return (
      <View className = { classString } onClick = { this.handleClick }>
        <View className = 'card-left'>
          <Avatar src = { avatar } size = { 64 } />
        </View>
        <View className = 'card-content'>
          <Text>{ nickName }</Text>
        </View>
        <View className = 'card-right'>
          <View className = 'card-tag' />
        </View>
      </View>
    )
  }
}
