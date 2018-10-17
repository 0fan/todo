import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Text } from '@tarojs/components'

import moment from 'moment'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card/taskCard'

import { getMyTask } from '../../model/user'

import './index.less'

@connect(state => ({
  user: state.user,
  task: state.task,
}), dispatch => ({
  getMyTask: (...rest) => dispatch(getMyTask(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的任务',
    navigationBarBackgroundColor: '#257AFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#257AFF',
    enablePullDownRefresh: true,
  }

  handleClick = (v, i, e) => {
    console.log(v, i)
  }

  render () {
    const {
      user: {
        nickName,
        avatarUrl,
      },
      task: {
        get_task_loading,
        data,

        ingCount,
        postponeCount,
        finishCount
      }
    } = this.props

    return (
      <Layout>
        <Panel
          title = { `你好 ${ nickName }` }
          extra = { `今天是 ${ moment().format('YYYY年M月D日') } 祝一切顺利 ！` }
          avatar = { avatarUrl }

          finishCount = { finishCount }
          ingCount = { ingCount }
          postponeCount = { postponeCount }

          dark
        />
        <Layout padding = { [100, 32, 64] }>
          <Sort />
          {
            data.map((v, i) => (
              <Card
                title = { v.taskCentent }
                project = { v.userGroup.groupName }

                status = { v.status }

                finishCountDays = { v.finishCountDays }
                postponeCountDays = { v.postponeCountDays }
                surplusCountDays = { v.surplusCountDays }

                onClick = { this.handleClick.bind(this, v, i) }

                key = { i }
              />
            ))
          }
        </Layout>
      </Layout>
    )
  }
}
