import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Text } from '@tarojs/components'

import Layout from '../../component/layout'
import Btn from '../../component/button'

import { showToast } from '../../util/wx'

import { login } from '../../model/user'

import brand from '../../asset/img/logo.png'

import './index.less'

@connect(state => ({
  user: state.user
}), dispatch => ({
  login: (...rest) => dispatch(login(...rest)),
}))
export default class Page extends Component {
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

    await this.props.login(userInfo, this.$router.params.r)
  }

  render () {
    return (
      <Layout padding = { [0, 112] }>
        <View className = 'brand' style = { { backgroundImage: `url(${ brand })` } } />

        <View className = 'title'>
          <Text>使用凸度前\n请先获取微信授权</Text>
        </View>

        <Btn
          openType = 'getUserInfo'
          onGetUserInfo = { this.handleGetUserInfo }
        >
          获取微信授权
        </Btn>
      </Layout>
    )
  }
}
