import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import cs from 'classnames'
import _ from 'lodash'

import './index.less'

export default class App extends Component {
  config = {
    // 第三方组件
    usingComponents: {
      'van-popup': '../vant/popup/index',
    }
  }

  state = {
    visible: false,
    value: '',
    data: []
  }

  componentDidMount () {
    const {
      visible = false,
      value = '',
      data = []
    } = this.props

    this.setState({
      visible,
      value,
      data
    })
  }

  componentWillReceiveProps (nextProps) {
    const obj = {}

    if (
      this.props.visible !== nextProps.visible
    ) {
      obj.visible = nextProps.visible
    }

    if (
      this.props.value !== nextProps.value
    ) {
      obj.value = nextProps.value
    }

    if (
      !_.isEqual(this.props.data, nextProps.data)
    ) {
      obj.data = nextProps.data
    }

    if (Object.keys(obj).length) {
      this.setState(obj)
    }
  }

  handleClick = (v, i, e) => {
    e.preventDefault()

    // 不重复除法change事件
    if (String(v.id) === String(this.state.value)) {
      return
    }

    this.setState({
      value: v.id
    })
  }

  handleOk = () => {
    this.props.onOk && this.props.onOk(this.state.value)
  }

  handleClose = () => {
    this.props.onClose && this.props.onClose()
  }

  render () {
    const {
      visible,
      value,
      data
    } = this.state

    if (!data) {
      return null
    }

    return (
      <van-popup
        show = { visible }
        onclose = { this.handleClose }
        duration = { 200 }
      >
        <View className = 'dialog'>
          <View className = 'dialog-header'>
            <View className = 'dialog-header-title'>切换小组</View>
          </View>
          <View className = 'dialog-body'>
            {
              !data.length ?
                <View className = 'dialog-no-data'>没有小组数据</View> :
                null
            }
            {
              data.length ?
                <View className = 'list'>
                  {
                    data.map((v, i) => (
                      <View
                        className = {
                          cs('item', {
                            'item-selected': String(v.id) === String(value)
                          })
                        }

                        onClick = { this.handleClick.bind(this, v, i) }

                        key = { i }
                      >
                        <View className = 'item-title'>{ v.groupName }</View>
                        <View className = 'item-after'>
                          <View className = 'switch' />
                        </View>
                      </View>
                    ))
                  }
                </View> :
                null
            }
          </View>
          <View className = 'dialog-footer'>
            <View className = 'dialog-action dialog-action-default' onClick = { this.handleClose }>取消</View>
            <View className = 'dialog-action' onClick = { this.handleOk }>切换</View>
          </View>
        </View>
      </van-popup>
    )
  }
}
