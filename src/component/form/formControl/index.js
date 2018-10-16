import Taro, { Component, pxTransform } from '@tarojs/taro'
import { View, Text, Input, Textarea } from '@tarojs/components'

import cs from 'classnames'

import style from './index.less'

export default class App extends Component {
  constructor (props) {
    super(props)

    const {
      value = ''
    } = this.props

    this.state = {
      value,
      edit: false
    }
  }

  // 同步数据
  componentWillReceiveProps (nextProps) {
    if (this.props.value !== nextProps.value) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  handleChange = e => {
    this.setState({
      value: e.target.value
    }, () => {
      this.props.onChange && this.props.onChange(this.state.value)
    })
  }

  handleFocus = e => {
    this.setState({
      edit: true
    })
  }

  handleBlur = e => {
    this.setState({
      edit: false
    })
  }

  render () {
    const {
      label,
      extra,

      disabled,
      placeholder,
      maxlength,

      // [String] 输入内容 label|input|textarea
      type
    } = this.props

    const {
      value,
      edit
    } = this.state

    const classString = cs('form-group', {
      ['form-group-edit']: edit,
      ['form-group-disabled']: disabled,
    })

    return (
      <View className = { classString }>
        {
          label || extra ?
            <View className = 'form-group-header'>
              <View className = 'form-group-label'>
                { label }
              </View>
              {
                extra ?
                  <View className = 'form-group-extra'>
                    { extra }
                  </View> :
                  null
              }
            </View> :
            null
        }
        <View className = 'form-group-body'>
          {
            type === 'label' ?
              <View className = 'form-control'>
                { this.props.children }
              </View> :
              null
          }
          {
            type === 'input' ?
              <View className = 'form-control'>
                <Input
                  value = { value }
                  placeholder = { placeholder }
                  disabled = { disabled }

                  onChange = { this.handleChange }
                  onFocus = { this.handleFocus }
                  onBlur = { this.handleBlur }
                />
              </View> :
              null
          }
          {
            type === 'textarea' ?
              <Textarea
                value = { value }
                placeholder = { placeholder }
                disabled = { disabled }
                maxlength = { maxlength }

                onChange = { this.handleChange }
                onFocus = { this.handleFocus }
                onBlur = { this.handleBlur }
              /> :
              null
          }
          {
            !type ?
              this.props.children :
              null
          }
        </View>
      </View>
    )
  }
}
