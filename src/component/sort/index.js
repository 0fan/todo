import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

import { showToast } from '../../util/wx'

import './index.less'

const sort = [
  '默认排序',
  '发布时间由近到远',
  '发布时间由远到近',
]

export default class App extends Component {
  handleClick = e => {
    this.props.onClick && this.props.onClick(e)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.type !== nextProps.type) {
      showToast({
        title: sort[nextProps.type]
      })
    }
  }

  render () {
    const {
      type = 0,
    } = this.props

    return (
      <View className = 'sort'>
        <View className = 'sort-content' onClick = { this.handleClick }>
          { sort[type] }
        </View>
        <View className = 'sort-right'>
          { this.props.children }
        </View>
      </View>
    )
  }
}
