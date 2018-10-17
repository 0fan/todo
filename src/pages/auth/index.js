import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'

import Layout from '../../component/layout'
import Btn from '../../component/button'

import { getSetting, getUserInfo, showToast } from '../../util/wx'

import { login } from '../../model/user'

import brand from '../../asset/img/logo.png'

import './index.less'

@connect(state => ({
  user: state.user
}), dispatch => ({
  login: (...rest) => dispatch(login(...rest)),
}))
export default class Page extends Component {
  state = {
    userInfo: null
  }

  // 先判断是否已授权,如果已授权则静默登录
  async componentWillMount () {
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
      this.login()
    })
  }

  handleGetUserInfo = async (e) => {
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
    }, () => {
      this.login()
    })
  }

  login = async () => {
    const [err, res] = await this.props.login(this.state.userInfo, this.$router.params.r)
  }

  render () {
    const {
      user: {
        login_loading,
        login_msg
      }
    } = this.props

    const {
      userInfo
    } = this.state

    let renderBottom = null

    if (login_loading) {
      renderBottom = (
        <View className = 'title'>
          <Text>登录中</Text>
        </View>
      )
    } else if (login_msg) {
      renderBottom = (
        <View className = 'title'>
          <Text>{ login_msg }</Text>
          <Text className = 'a' onClick = { this.login }>重试</Text>
        </View>
      )
    } else {
      renderBottom = (
        <View className = 'title'>
          <Text>使用凸度前\n请先获取微信授权</Text>
        </View>
      )
    }

    return (
      <Layout padding = { [0, 112] }>
        <View className = 'brand' style = { { backgroundImage: `url(${ brand })` } } />

        { renderBottom }

        {
          !userInfo ?
            <Btn
              openType = 'getUserInfo'
              onGetUserInfo = { this.handleGetUserInfo }
            >
              获取微信授权
            </Btn> :
            null
        }
      </Layout>
    )
  }
}
