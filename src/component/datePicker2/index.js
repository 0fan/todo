import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'

import _ from 'lodash'
import moment from 'moment'

import FormControl from '../form/formControl'

import './index.less'

export default class App extends Component {
  state = {
    value: ''
  }

  componentDidMount () {
    const {
      value
    } = this.props

    this.setState({
      value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      this.setState({
        value: nextProps.value
      })
    }
  }

  handleChange = (type, e) => {
    const { value } = e.detail

    if (type === 'date') {
      this.setState(prevState => ({
        value: `${ value }${ prevState.value.slice(10) ? prevState.value.slice(10) : ' 00:00' }`
      }), () => {
        this.props.onChange && this.props.onChange({
          target: {
            value: this.state.value
          }
        })
      })
    } else {
      this.setState(prevState => ({
        value: `${ prevState.value.slice(0, 10) } ${ value }`
      }), () => {
        this.props.onChange && this.props.onChange({
          target: {
            value: this.state.value
          }
        })
      })
    }
  }

  render () {
    const {
      // value,
      // label,
      // placeholder = '请选择时间',
      disabled
    } = this.props

    const {
      value
    } = this.state

    let date = ''
    let time = ''

    if (_.isString(value)) {
      date = value.slice(0, 10)
      time = value.slice(10)
    }

    return (
      <View className = 'row'>
        <Picker
          mode = 'date'
          value = { date }

          onchange = { this.handleChange.bind(this, 'date') }

          disabled = { disabled }
        >
          <FormControl label = '任务截止日期' type = 'label' disabled = { disabled }>
            { date ? date : '请选择任务截止日期' }
          </FormControl>
        </Picker>
        <Picker
          mode = 'time'
          value = { time }

          onchange = { this.handleChange.bind(this, 'time') }

          disabled = { disabled }
        >
          <FormControl label = '任务截止时间' type = 'label' disabled = { disabled }>
            { time ? time : '请选择任务截止时间' }
          </FormControl>
        </Picker>
      </View>
    )
  }
}
