import Taro, { Component, navigateTo } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import cs from 'classnames'

import style from './index.less'

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

  handleAddClick = e => {
    this.handleClick(e)
  }

  render () {
    const {
      // [Boolean] 是否是添加小组卡片
      isAdd,

      // [Boolean] 是否是当前小组
      isCurrent,

      title,
      // [String] 小组类型 work|tour|life
      type,
      // [Number] 成员数量
      member = 0,
      disabled,
    } = this.props

    if (isAdd) {
      return (
        <View className = 'add-card' onClick = { this.handleAddClick }>
          <Text>创建一个新的小组</Text>
        </View>
      )
    }

    const classString = cs('card', {
      [`card-${ type }`]: type,
      'card-disabled': disabled,
    })

    return (
      <View className = { classString } onClick = { this.handleClick }>
        <View className = 'card-body'>
          <View className = 'card-body-left'>
            <Text>{ title }</Text>
          </View>
          <View className = 'card-body-right'>
            {
              isCurrent ?
                <View className = 'card-tag'>当前</View> :
                null
            }
          </View>
        </View>
        <View className = 'card-footer'>
          <View className = 'card-footer-left'>
            <Text>成员共{ member }人</Text>
          </View>
          <View className = 'card-footer-right'>
            <View className = 'card-arrow' />
          </View>
        </View>
      </View>
    )
  }
}
