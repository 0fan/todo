import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import _ from 'lodash'
import cs from 'classnames'

import './index.less'

export default class App extends Component {
  render () {
    const {
      title = '数据获取失败',
    } = this.props

    const classString = cs('fail', {})

    return (
      <View className = { classString }>
        <View className = 'title'>
          <Text>{ title }</Text>
          { this.props.children }
        </View>
      </View>
    )
  }
}
