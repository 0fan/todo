import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View , Text} from '@tarojs/components'

import _ from 'lodash'
import cs from 'classnames'

import Avatar from '../avatar'

import './index.less'

export default class App extends Component {
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

      avatar
    } = this.props

    const hasFooter = (
      !_.isNil(finishCount) &&
      !_.isNil(ingCount) &&
      !_.isNil(postponeCount)
    )

    const classString = cs('panel', {
      ['panel-dark']: dark,
      ['panel-has-avatar']: avatar,
      ['panel-has-footer']: hasFooter,
    })

    return (
      <View className = { classString }>
        <View className = 'panel-body'>
          <View className = 'panel-content'>
            <View className = 'h1'><Text>{ title }</Text></View>
            <View className = 'extra'>{ extra }</View>
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
                <View className = 'panel-card-value'>{ finishCount }</View>
                <View className = 'panel-card-label'>进行中</View>
              </View>
              <View className = 'panel-card panel-card-fail'>
                <View className = 'panel-card-value'>{ ingCount }</View>
                <View className = 'panel-card-label'>进行中</View>
              </View>
              <View className = 'panel-card panel-card-success'>
                <View className = 'panel-card-value'>{ postponeCount }</View>
                <View className = 'panel-card-label'>进行中</View>
              </View>
            </View> :
            null
        }
      </View>
    )
  }
}
