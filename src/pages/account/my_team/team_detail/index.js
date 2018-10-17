import Taro, { Component, navigateBack } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../../../component/layout'
import Panel from '../../../../component/panel'
import Btn from '../../../../component/button'
import Card from '../../../../component/card/memberCard'

import { showModal, showLoading, hideLoading, showToast } from '../../../../util/wx'

import { addTeam, getTeamMember, removeTeam } from '../../../../model/team/method'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({
  removeTeam: (...rest) => dispatch(removeTeam(...rest)),
  getTeamMember: (...rest) => dispatch(getTeamMember(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '小组详情',
    backgroundColor: '#eee',
    enablePullDownRefresh: true,
  }

  state = {
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
      id,
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
      showToast({
        title: err
      })

      return
    }

    const {
      userinfos
    } = res

    this.setState({
      member: userinfos,
    })
  }

  handleClick = async (v, i, e) => {
    console.log(v)
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

  render () {
    const {
      groupName,
      member
    } = this.state

    return (
      <Layout padding = { [0, 60, 60] }>
        <Panel title = { groupName } collapse />
        <Layout padding = { [56, 0, 60] }>
          {
            member.map((v, i) => (
              <Card
                avatar = { v.avatarUrl }
                nickName = { v.nickName }
                isCreator = { v.isGroupLeader === '1' }
                disabled = { v.isGroupLeader === '1' }

                onClick = { this.handleClick.bind(this, v, i) }

                key = { i }
              />
            ))
          }
        </Layout>

        <Btn onClick = { this.handleDelete }>退出该小组</Btn>
      </Layout>
    )
  }
}
