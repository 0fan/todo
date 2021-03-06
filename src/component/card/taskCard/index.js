import Taro, { Component, navigateTo } from '@tarojs/taro'
import { View } from '@tarojs/components'

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

  handleLongPress = (e) => {
    this.props.onLongPress && this.props.onLongPress(e)
  }

  render () {
    const {
      title,
      project,

      status,
      disabled,

      finishCountDays,
      postponeCountDays,
      surplusCountDays,
    } = this.props

    const classString = cs('card', {
      'card-progress': status === '2',
      'card-fail': status === '0',
      'card-success': status === '1',
      'card-disabled': disabled,
    })

    return (
      <View
        className = { classString }
        onClick = { this.handleClick }
        onLongPress = { this.handleLongPress }
      >
        <View className = 'card-left'>
          <View className = 'card-status' />
        </View>
        <View className = 'card-content'>
          <View className = 'card-title'>{ title }</View>
          <View className="card-extra">
            <View className = 'card-project'>{ project ? project : '' }</View>
            <View className = 'card-date'>
              { status === '1' ? `完成${ finishCountDays }天` : '' }
              { status === '2' ? `剩余${ surplusCountDays }天` : '' }
              { status === '0' ? `延期${ postponeCountDays }天` : '' }
            </View>
          </View>
        </View>
      </View>
    )
  }
}
