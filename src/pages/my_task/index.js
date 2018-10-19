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

import { showToast, showModal, showLoading, hideLoading } from '../../util/wx'

import { getMyTask } from '../../model/task'
import { removeTeamTask } from '../../model/team/method'

import { pipeTask } from '../../util/pipeTask'

import './index.less'

@connect(state => ({
  user: state.user,
  task: state.task,
}), dispatch => ({
  getMyTask: (...rest) => dispatch(getMyTask(...rest)),
  removeTeamTask: (...rest) => dispatch(removeTeamTask(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的任务',
    navigationBarBackgroundColor: '#257AFF',
    navigationBarTextStyle: 'white',
    backgroundColor: '#257AFF',
    enablePullDownRefresh: true,
  }

  state = {
    // 过滤类型
    filterType: {
      finish: 1,
      ing: 1,
      postpone: 1,
    },
    // 排序方式
    sortType: 0
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

  // 长按删除
  handleLongPress = async (v, i, e) => {
    const {
      removeTeamTask
    } = this.props

    const sure = await showModal({ content: '确认删除此任务吗?' })

    if (!sure) {
      return
    }

    showLoading({
      title: '删除中',
    })

    const [err, res] = await removeTeamTask({
      taskId: v.id
    })

    if (err) {
      showToast({
        title: err
      })

      return
    }

    showToast({
      title: '删除成功',
      icon: 'success'
    })
  }

  handleSort = () => {
    this.setState(prevState => ({
      sortType: (prevState.sortType + 1) % 3
    }))
  }

  handleFinishCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       finish: prevState.filterType.finish === 0 ? 1 : 0
      }
    }))
  }

  handleIngCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       ing: prevState.filterType.ing === 0 ? 1 : 0
      }
    }))
  }

  handlePostponeCountClick = () => {
    this.setState(prevState => ({
      filterType: {
        ...prevState.filterType,
       postpone: prevState.filterType.postpone === 0 ? 1 : 0
      }
    }))
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

    const {
      filterType,
      sortType
    } = this.state

    const _data = pipeTask(data, filterType, sortType)

    return (
      <Layout>
        <Panel
          title = { `你好 ${ nickName }` }
          extra = { `今天是 ${ moment().format('YYYY年M月D日') } 祝一切顺利 ！` }
          avatar = { avatarUrl }

          filterType = { filterType }

          finishCount = { finishCount }
          ingCount = { ingCount }
          postponeCount = { postponeCount }

          onFinishCountClick = { this.handleFinishCountClick }
          onIngCountClick = { this.handleIngCountClick }
          onPostponeCountClick = { this.handlePostponeCountClick }

          dark
        />

        <Layout padding = { [100, 32, 64] }>
          {
            get_task_loading || !get_task_init ?
              <Loading /> :
              get_task_msg ?
                <Fail><Text className = 'a' onClick = { this.getMyTask }>重试</Text></Fail> :
                !_data.length ?
                  <View>
                    <Sort type = { sortType } onClick = { this.handleSort } />
                    <Empty />
                  </View> :
                  <View>
                    <Sort type = { sortType } onClick = { this.handleSort } />
                    {
                      _data.map((v, i) => (
                        <Card
                          title = { v.taskCentent }
                          project = { v.userGroup.groupName }

                          status = { v.status }

                          finishCountDays = { v.finishCountDays }
                          postponeCountDays = { v.postponeCountDays }
                          surplusCountDays = { v.surplusCountDays }

                          to = { `/pages/task_detail/index?id=${ v.id }` }
                          onLongPress = { this.handleLongPress.bind(this, v, i) }

                          key = { i }
                        />
                      ))
                    }
                  </View>
          }
        </Layout>
      </Layout>
    )
  }
}
