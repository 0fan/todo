import Taro, { Component, reLaunch, redirectTo, switchTab } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text, Input } from '@tarojs/components'

import qs from 'qs'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import Btn from '../../component/button'
import Brand from '../../component/brand'

import { login } from '../../model/user'
import { addTeamMember } from '../../model/team/method'

import { getSetting, getUserInfo, showToast, showModal, showLoading, hideLoading } from '../../util/wx'

import './index.less'

@connect(state => ({
  user: state.user
}), dispatch => ({
  login: (...rest) => dispatch(login(...rest)),
  addTeamMember: (...rest) => dispatch(addTeamMember(...rest)),
}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '凸度',
  }

  state = {
    groupId: '',
    groupName: '',
    nickName: '',
    avatarUrl: '',

    userInfo: null
  }

  async componentWillMount () {
    const {
      user: {
        isLogin
      }
    } = this.props

    const {
      // 邀请加入小组id
      groupId,
      // 邀请加入小组名称
      groupName,

      // 邀请人昵称
      nickName,
      // 邀请人头像
      avatarUrl,
    } = this.$router.params
    console.log(this.$router.params)

    const error = []

    if (!groupId) {
      error.push('缺少小组id')
    }

    if (!groupName) {
      error.push('缺少小组名称')
    }

    if (!nickName) {
      error.push('缺少邀请者名称')
    }

    if (!avatarUrl) {
      error.push('缺少邀请者头像')
    }

    if (error.length) {
      const sure = await showModal({
        showCancel: false,
        content: error[0],
        confirmText: '进入小组',
      })

      if (sure) {
        redirectTo({
          url: '/pages/auth/index'
        })

        return
      }

      // redirectTo({
      //   url: `/pages/invite/index?${ qs.stringify({
      //     groupId: '1810181110133860',
      //     groupName: '不知凑',
      //     nickName: '林凡',
      //     avatarUrl: 'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIkofT10iafibHicm4HkBFSnUSBgTezUf1j9elBKSbTrPbKaHibcp7CgnLvibeGsZsJTNLibMnqvWn2Ojbw/132',
      //   }) }`
      // })

      return
    }

    this.setState({
      groupId,
      groupName: decodeURIComponent(groupName),
      nickName: decodeURIComponent(nickName),
      avatarUrl: decodeURIComponent(avatarUrl)
    })

    const isUserInfo =  await getSetting('userInfo')

    if (!isUserInfo) {
      return
    }

    const userInfo = await getUserInfo()

    if (!userInfo) {
      return
    }

    this.setState({
      userInfo
    }, () => {
      if (!isLogin) {
        this.login()
      }
    })
  }

  handleGetUserInfo = async (e) => {
    const {
      user: {
        isLogin
      }
    } = this.props

    // 如果已经登录则加入小组
    if (isLogin) {
      this.handleJoin()

      return
    }

    // 没有登录则登录
    const {
      detail: {
        userInfo
      }
    } = e

    if (!userInfo) {
      showToast({ title: '授权失败' })

      return
    }

    this.setState({
      userInfo
    }, async () => {
      const [err, res] = await this.login()

      if (!err) {
        this.handleJoin()
      }
    })
  }

  login = async () => {
    showLoading({ title: '登录中' })

    const [err, res] = await this.props.login(this.state.userInfo, false)

    hideLoading()

    if (err) {
      showToast({ title: err })

      return [err]
    }

    showToast({
      title: '登录成功',
      icon: 'success'
    })

    return [null, res]
  }

  handleJoin = async () => {
    const {
      nickName,
      avatarUrl,
      groupName,
      groupId,
      userInfo
    } = this.state

    const {
      user: {
        id
      },
      addTeamMember
    } = this.props

    showLoading({ title: '加入小组中' })

    const [err, res] = await addTeamMember({
      userId: id,
      groupId,
      groupName,
      nickName: userInfo.nickName
    }, groupId)

    hideLoading()

    if (err) {
      const sure = await showModal({
        content: err,
        confirmText: '进入小组',
        cancelText: '确定',
        showCancel: true
      })

      if (sure) {
        switchTab({
          url: '/pages/team_task/index'
        })

        return
      }

      return
    }

    await showToast({
      title: '加入小组成功',
      icon: 'success'
    })

    // redirectTo({
    //   url: '/pages/auth/index'
    // })
    switchTab({
      url: '/pages/team_task/index'
    })
  }

  render () {
    const {
      user: {
        isLogin
      }
    } = this.props

    const {
      nickName,
      avatarUrl,
      groupName
    } = this.state

    return (
      <Layout padding = { [0, 60, 60] }>
        <Panel
          avatar = { avatarUrl }
          title = { nickName }

          type = 'left'
        />

        <View className = 'title'>
          <Text>{ groupName }</Text>
        </View>

        {
          isLogin ?
            <Btn
              onClick = { this.handleJoin }
            >
              加入该小组
            </Btn> :
            <Btn
              openType = 'getUserInfo'
              onGetUserInfo = { this.handleGetUserInfo }
            >
              加入该小组
            </Btn>
        }

        <Brand />
      </Layout>
    )
  }
}
