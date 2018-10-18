import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

import _ from 'lodash'
import cs from 'classnames'

import Avatar from '../avatar'

import './index.less'

export default class App extends Component {
  handleSwitchClick = e => {
    this.props.visibleSwitch && this.props.onSwitch && this.props.onSwitch()
  }

  handleExtraClick = e => {
    this.props.onExtraClick && this.props.onExtraClick(e)
  }

  render () {
    const {
      title,
      extra,

      // 完成任务数
      finishCount,
      // 进行中任务数
      ingCount,
      // 延期任务数
      postponeCount,

      dark,

      avatar,

      // [Boolean] 是否取消左右padding
      collapse,

      // [String] 类型 center[对应我的信息]/left[对应邀请]
      type,

      // [Boolean] 是否显示切换小组按钮 因为右侧已经被this.props.children使用了
      visibleSwitch,
      // [Function] 点击切换小组事件
      onSwitch
    } = this.props

    if (type === 'center') {
      return (
        <View className = 'center-panel'>
          <View className = 'center-panel-avatar'>
            <Avatar size = { 140 } src = { avatar } />
          </View>
          <View className = 'center-panel-title'>
            <Text>{ title }</Text>
          </View>
        </View>
      )
    }

    if (type === 'left') {
      return (
        <View className = 'left-panel'>
          <View className = 'left-panel-left'>
            <Avatar size = { 108 } src = { avatar } />
          </View>
          <View className = 'left-panel-content'>
            <View className = 'left-panel-title'>
              <Text>{ title }</Text>
            </View>
            <View className = 'left-panel-extra'>邀请你加入</View>
          </View>
        </View>
      )
    }

    const hasFooter = (
      !_.isNil(finishCount) &&
      !_.isNil(ingCount) &&
      !_.isNil(postponeCount)
    )

    const classString = cs('panel', {
      ['panel-dark']: dark,
      ['panel-collapse']: collapse,
      ['panel-simple']: !extra && !avatar && !hasFooter,
      ['panel-has-extra']: extra,
      ['panel-has-avatar']: avatar,
      ['panel-has-footer']: hasFooter,
    })

    return (
      <View className = { classString }>
        <View className = 'panel-body'>
          <View className = 'panel-content'>
            <View className = 'h1'>
              <Text onClick = { this.handleSwitchClick }>{ title }</Text>
              {
                visibleSwitch ?
                  <Text onClick = { this.handleSwitchClick } className = 'switch' /> :
                  null
              }
            </View>
            {
              extra ? <View className = 'extra' onClick = { this.handleExtraClick }>{ extra }</View> : null
            }
          </View>
          <View className = 'panel-right'>
            {
              avatar ?
                <Avatar src = { avatar } /> :
                null
            }
            { this.props.children }
          </View>
        </View>
        {
          hasFooter ?
            <View className = 'panel-footer'>
              <View className = 'panel-card panel-card-progress'>
                <View className = 'panel-card-value'>{ ingCount }</View>
                <View className = 'panel-card-label'>进行中</View>
              </View>
              <View className = 'panel-card panel-card-fail'>
                <View className = 'panel-card-value'>{ postponeCount }</View>
                <View className = 'panel-card-label'>延期中</View>
              </View>
              <View className = 'panel-card panel-card-success'>
                <View className = 'panel-card-value'>{ finishCount }</View>
                <View className = 'panel-card-label'>已完成</View>
              </View>
            </View> :
            null
        }
      </View>
    )
  }
}
