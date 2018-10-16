import Taro, { Component } from '@tarojs/taro'
import { View, Text, Picker } from '@tarojs/components'

import _ from 'lodash'
import cs from 'classnames'

import FormControl from '../form/formControl'

import style from './index.less'

const now = new Date()

const date = [
  [...Array(20)].map((v, i) => {
    // 从当前年开始
    const d = now.getFullYear() + i

    return {
      label: d + '年',
      value: d
    }
  }),
  [...Array(12)].map((v, i) => {
    const d = i + 1

    return {
      label: d + '月',
      value: d
    }
  }),
  [...Array(31)].map((v, i) => {
    const d = i + 1

    return {
      label: d + '日',
      value: d
    }
  }),
  [...Array(24)].map((v, i) => {
    const d = i

    return {
      label: d + '时',
      value: d
    }
  }),
  [...Array(60)].map((v, i) => {
    const d = i

    return {
      label: d + '分',
      value: d
    }
  }),
  // [...Array(60)].map((v, i) => {
  //   const d = i

  //   return {
  //     label: d + '秒',
  //     value: d
  //   }
  // }),
]

export default class App extends Component {
  constructor (props) {
    super(props)

    const {
      value
    } = props

    const indexValue = this.dateToIndexValue(value, date)
    const displayValue = this.indexValueToDisplayDate(indexValue, date)
    const formatValue = this.indexValueToDate(indexValue, date)

    this.state = {
      // 下标值
      indexValue,
      // 显示的值
      displayValue,
      // YYYY-MM-DD HH:mm:SS格式的值
      formatValue,
      // 用户传递的值
      value,

      date
    }
  }

  // 同步数据
  componentWillReceiveProps (nextProps) {
    if (!_.isEqual(this.props.value, nextProps.value)) {
      const indexValue = this.dateToIndexValue(nextProps.value)
      const displayValue = this.indexValueToDisplayDate(indexValue)
      const formatValue = this.indexValueToDate(indexValue)

      this.setState({
        value: nextProps.value,
        indexValue,
        displayValue,
        formatValue,
      })
    }
  }

  /**
   * [时间格式的值转换成下标数组,如果时间格式不能解析则默认为当前日期时间]
   * @param  {String} v    [需要转换的时间值]
   * @param  {[type]} date [日期选择数组]
   * @return {Array}       [下标数组]
   */
  dateToIndexValue = (v = '', date) => {
    date = date || this.state.date

    // 验证时间格式
    let d = new Date(v)

    if (isNaN(d.getTime())) {
      if (!isNaN(Number(v))) {
        d = new Date(Number(v))
      } else {
        d = new Date()
      }
    }

    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const day = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    // const seconds = d.getSeconds()

    let yearIndex = _.findIndex(date[0], v => v.value === year)
    let monthIndex = _.findIndex(date[1], v => v.value === month)
    let dayIndex = _.findIndex(date[2], v => v.value === day)
    let hoursIndex = _.findIndex(date[3], v => v.value === hours)
    let minutesIndex = _.findIndex(date[4], v => v.value === minutes)
    // let secondsIndex = _.findIndex(date[5], v => v.value === seconds)

    return [
      yearIndex < 0 ? 0 : yearIndex,
      monthIndex < 0 ? 0 : monthIndex,
      dayIndex < 0 ? 0 : dayIndex,
      hoursIndex < 0 ? 0 : hoursIndex,
      minutesIndex < 0 ? 0 : minutesIndex,
      // secondsIndex < 0 ? 0 : secondsIndex,
    ]
  }

  /**
   * [下标值转换显示的值]
   * @param  {[type]} indexValue [下标数组]
   * @param  {[type]} date       [日期选择数组]
   * @return {String}
   */
  indexValueToDisplayDate = (indexValue, date) => {
    indexValue = indexValue || this.state.indexValue
    date = date || this.state.date

    const label = indexValue.map((v, i) => date[i][v] ? date[i][v].label : '').join('')

    return label
  }

  /**
   * [数组下标值转换成YYYY-MM-DD HH:mm:SS格式的字符串]
   * @param  {[type]} indexValue [下标数组]
   * @param  {[type]} date       [日期选择数组]
   * @return {String}
   */
  indexValueToDate = (indexValue, date) => {
    indexValue = indexValue || this.state.indexValue
    date = date || this.state.date

    const label = indexValue.map((v, i) => date[i][v] ? date[i][v].value : '').map(v => v < 10 ? '0' + v : v)

    return label.slice(0, 3).join('-').concat(' ').concat(label.slice(3).join(':'))
  }

  handleChange = e => {
    this.setState(prevState => ({
      indexValue: e.detail.value,
      displayValue: this.indexValueToDisplayDate(e.detail.value),
      formatValue: this.indexValueToDate(e.detail.value)
    }), () => {
      this.props.onChange && this.props.onChange({
        target: {
          value: this.state.formatValue
        }
      })
    })
  }

  render () {
    const {
      date,
      indexValue,
      displayValue
    } = this.state

    const {
      label,
      placeholder = '请选择时间',
      disabled
    } = this.props

    return (
      <Picker
        range = { date }
        value = { indexValue }

        onchange = { this.handleChange }

        disabled = { disabled }

        mode = 'multiSelector'
        rangeKey = 'label'
      >
        <FormControl label = { label } type = 'label' disabled = { disabled }>
          { displayValue ? displayValue : placeholder }
        </FormControl>
      </Picker>
    )
  }
}
