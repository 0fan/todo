import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View } from '@tarojs/components'

import _ from 'lodash'

export default class App extends Component {
  render () {
    const {
      padding
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

    return (
      <View className = 'page' style = { styleString }>
        { this.props.children }
      </View>
    )
  }
}
