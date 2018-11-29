import Taro, { Component, navigateBack } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../../../component/layout'
import Panel from '../../../../component/panel'
import Btn from '../../../../component/button'
import Card from '../../../../component/card/memberCard'
import Loading from '../../../../component/loading'
import Fail from '../../../../component/fail'

import { showModal, showLoading, hideLoading, showToast } from '../../../../util/wx'

import { addTeam, getTeamMember, removeTeamMember, removeTeam } from '../../../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  removeTeam: (...rest) => dispatch(removeTeam(...rest)),
  getTeamMember: (...rest) => dispatch(getTeamMember(...rest)),
  removeTeamMember: (...rest) => dispatch(removeTeamMember(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '小组详情',
    backgroundColor: '#eee',
    // enablePullDownRefresh: true,
  }

  state = {
    // 小组id
    id: '',
    groupName: '',
    member: []
  }

  componentWillMount () {
    const {
      params: {
        id
      }
    } = this.$router

    const {
      team: {
        data
      }
    } = this.props

    if (!id || !data[id]) {
      navigateBack()

      return
    }

    this.setState({
      id: Number(id),
      member: data[id].member,
      groupName: data[id].groupName,
    })

    if (!data[id].get_member_data_init) {
      this.getMember(id)
    }
  }

  getMember = async (id) => {
    showLoading({
      title: '获取小组成员中',
    })

    const [err, res] = await this.props.getTeamMember({}, {
      teamId: id
    })

    hideLoading()

    if (err) {
      await showToast({
        title: err
      })

      navigateBack()

      return
    }

    const {
      userinfos
    } = res

    this.setState({
      member: userinfos,
    })
  }

  /**
   * [点击用户信息删除成员]
   * [1.只能当自己是管理员才能删除]
   * [2.不能删除自己]
   * @param  {Object} v [数据]
   * @param  {Number} i [下标]
   * @param  {event}  e
   * @return {void}
   */
  handleMemberClick = async (v, i, e) => {
    const {
      user: {
        id: userId
      },
      team: {
        data
      },
    } = this.props

    const {
      // 小组id
      id
    } = this.state

    const teamData = data[id]

    if (!teamData) {
      return
    }

    // 只能是小组的创建者才能删除成员
    if (teamData.creator !== userId) {
      return
    }

    // 自己不能删除自己
    if (v.id === userId) {
      return
    }

    const sure = await showModal({ content: `确认删除该[${ v.nickName }]吗?` })

    if (!sure) {
      return
    }

    showLoading({
      title: `删除[${ v.nickName }]中...`,
    })

    const [err, res] = await this.props.removeTeamMember({
      excType: 1,
      groupId: id,
      userId: v.id
    }, {
      id: id,
    })

    hideLoading()

    if (err) {
      showToast({
        title: err
      })

      return
    }

    showToast({
      title: `删除[${ v.nickName }]成功`,
      icon: 'success'
    })
  }

  // 解散小组
  handleDelete = async () => {
    const {
      user: {
        id
      }
    } = this.props

    const sure = await showModal({ content: '确认解散该小组吗?' })

    if (!sure) {
      return
    }

    showLoading({
      title: '解散小组中',
    })

    const [err, res] = await this.props.removeTeam({
      excType: 3,
      groupId: this.state.id,
      userId: id
    }, {
      id: this.state.id,
    })

    wx.hideLoading()

    if (err) {
      showToast({
        title: err
      })

      return
    }

    await showToast({
      title: '解散成功'
    })

    navigateBack()
  }

  // 退出小组
  handleQuit = async () => {
    const {
      user: {
        id
      }
    } = this.props

    const sure = await showModal({ content: '确认退出该小组吗?' })

    if (!sure) {
      return
    }

    showLoading({
      title: '退出小组中',
    })

    const [err, res] = await this.props.removeTeam({
      excType: 2,
      groupId: this.state.id,
      userId: id
    }, {
      id: this.state.id,
    })

    wx.hideLoading()

    if (err) {
      showToast({
        title: err
      })

      return
    }

    await showToast({
      title: '退出成功'
    })

    navigateBack()
  }

  render () {
    const {
      id,
      groupName,
      member
    } = this.state

    const {
      team: {
        data
      },
      user
    } = this.props

    const teamData = data[id]

    if (!teamData) {
      return <Loading />
    }

    return (
      <View className = 'page'>
        <View className = 'page-content'>
          <Panel title = { groupName } collapse />
          <Layout padding = { [56, 0, 60] }>
            {
              !teamData || teamData.get_member_data_loading ?
                <Loading /> :
                  teamData.get_member_data_msg ?
                    <Fail title = { teamData.get_member_data_msg } /> :
                    member.map((v, i) => (
                      <Card
                        avatar = { v.avatarUrl }
                        nickName = { v.nickName }
                        isCreator = { v.isGroupLeader === '1' }

                        onClick = { this.handleMemberClick.bind(this, v, i) }

                        key = { i }
                      />
                    ))
            }
          </Layout>
        </View>

        {
          !teamData || teamData.get_member_data_loading || teamData.get_member_data_msg ?
            null :
            teamData.creator === user.id ?
              <Btn onClick = { this.handleDelete }>解散该小组</Btn> :
              <Btn onClick = { this.handleQuit }>退出该小组</Btn>
        }
      </View>
    )
  }
}
