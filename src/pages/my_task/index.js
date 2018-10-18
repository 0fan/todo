import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Text } from '@tarojs/components'

import moment from 'moment'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Sort from '../../component/sort'
import Card from '../../component/card/taskCard'
import Empty from '../../component/empty'
import Loading from '../../component/loading'
import Fail from '../../component/fail'

import { showToast } from '../../util/wx'

import { getMyTask } from '../../model/task'

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

  // 下拉刷新
  onPullDownRefresh = async () => {
    const {
      task: {
        get_task_loading
      }
    } = this.props

    if (get_task_loading) {
      wx.stopPullDownRefresh() //停止下拉刷新

      return
    }

    wx.showNavigationBarLoading()

    const [err, res] = await this.getMyTask()

    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新

    if (!err) {
      showToast({ title: '刷新成功' })
    }
  }

  onShareAppMessage = res => {
    return {
      title: '凸度',
      path: '/pages/my_task/index'
    }
  }

  getMyTask = ()  => {
    return this.props.getMyTask({}, { isRefresh: true })
  }

  render () {
    const {
      user: {
        nickName,
        avatarUrl,
      },
      task: {
        get_task_init,
        get_task_loading,
        get_task_msg,
        data,

        ingCount,
        postponeCount,
        finishCount
      }
    } = this.props

    const renderChildren = null

    if (get_task_loading || !get_task_init) {
      renderChildren = <Loading />
    } else if (get_task_msg) {
      renderChildren = <Fail><Text className = 'a' onClick = { this.getMyTask }>重试</Text></Fail>
    } else if (!data.length) {
      renderChildren = (
        <View>
          <Sort />
          <Empty />
        </View>
      )
    } else {
      renderChildren = (
        <View>
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

                to = { `/pages/task_detail/index?id=${ v.id }` }

                key = { i }
              />
            ))
          }
        </View>
      )
    }

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
          { renderChildren }
        </Layout>
      </Layout>
    )
  }
}
