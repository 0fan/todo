import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View } from '@tarojs/components'

import cs from 'classnames'
import _ from 'lodash'

export default class App extends Component {
  render () {
    const {
      padding,
      flex
    } = this.props

    let styleString = {}

    if (_.isString(padding)) {
      styleString.padding = padding
    }

    if (_.isNumber(padding)) {
      styleString.padding = pxTransform(padding)
    }

    if (_.isArray(padding)) {
      styleString.padding = padding.map(v => pxTransform(v)).join(' ')
    }

    const classString = cs('layout', {
      'layout-flex': flex
    })

    return (
      <View className = { classString } style = { styleString }>
        { this.props.children }
      </View>
    )
  }
}
