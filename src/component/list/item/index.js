import Taro, { Component, navigateTo } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

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
      icon,
      title,

      to,
      disabled
    } = this.props

    const classString = cs('item', {
      ['item-has-icon']: icon,
      ['item-link']: to,
      ['item-disabled']: disabled,
    })

    return (
      <View className = { classString } onClick = { this.handleClick }>
        <View className = 'item-left'>
          <View className = { cs('item-icon', `item-icon-${ icon }`) } />
        </View>
        <View className = 'item-content'>{ title }</View>
        <View className = 'item-right'>
          { to ? <View className = 'item-arrow' /> : null }
        </View>
      </View>
    )
  }
}
