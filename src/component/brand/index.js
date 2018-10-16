import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './index.less'

export default class App extends Component {
  render () {
    const {
      title = '凸度 - 专注每一件小事',
      version = 'BETA',

      visibleVersion = true
    } = this.props

    return (
      <View className = 'brand'>
        <View className = 'brand-title'>
          <Text>{ title }</Text>
        </View>
        {
          visibleVersion ?
            <View className = 'brand-version'>
              <Text>{ version }</Text>
            </View> :
            null
        }
      </View>
    )
  }
}
