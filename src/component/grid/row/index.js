import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import style from './index.less'

export default class App extends Component {
  render () {
    const {
      gutter
    } = this.props

    let styleString = {}

    if (gutter > 0) {
      styleString.marginRight = -pxTransform(gutter / 2)
      styleString.marginLeft = styleString.marginRight
    }

    return (
      <View className = 'row' style = { styleString }>
        { this.props.children }
      </View>
    )
  }
}
