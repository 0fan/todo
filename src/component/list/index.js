import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

import './index.less'

export default class App extends Component {
  render () {
    return (
      <View className = 'list'>
        { this.props.children }
      </View>
    )
  }
}
