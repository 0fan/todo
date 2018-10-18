import Taro, { Component } from '@tarojs/taro'
import { View, Form, Button } from '@tarojs/components'

import cs from 'classnames'

import ajax from '../../util/ajax'
import { url, api } from '../../config/api'

import './index.less'

export default class App extends Component {
  handleSubmit = e => {
    if (e.detail.formId == 'the formId is a mock one') {
      return
    }

    ajax(url.server + api.saveFormId, {
      formIds: `"${ e.detail.formId }"`
    })
  }

  handleClick = e => {
    this.props.onClick && this.props.onClick(e)
  }

  render () {
    const {
      type = 'primary',
      openType,
      onGetUserInfo,
      plain,
      disabled,

      className
    } = this.props

    const classString = cs(className)

    return (
      <Form onSubmit = { this.handleSubmit } reportSubmit = { true }>
        <Button
          type = { type }
          openType = { openType }
          plain = { plain }
          disabled = { disabled }

          className = { classString }

          formType = 'submit'

          onClick = { this.handleClick }
          onGetUserInfo = { onGetUserInfo }
        >
          { this.props.children }
        </Button>
      </Form>
    )
  }
}
