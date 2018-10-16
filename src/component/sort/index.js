import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

import './index.less'

export default class App extends Component {
  handleClick = e => {
    this.props.onClick && this.props.onClick(e)
  }

  render () {
    const {
      type
    } = this.props

    return (
      <View className = 'sort' onClick = { this.handleClick }>
        <View className = 'sort-content'>
          按剩余时间排序
        </View>
        <View className = 'sort-right'>
          { this.props.children }
        </View>
      </View>
    )
  }
}
