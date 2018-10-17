import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View } from '@tarojs/components'

import Layout from '../../component/layout'
import Panel from '../../component/panel'
import List from '../../component/list'
import Item from '../../component/list/item'
import Brand from '../../component/brand'

import { getMyTask } from '../../model/user'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '个人中心',
  }

  render () {
    const {
      user: {
        nickName,
        avatarUrl,
      },
      team: {
        data
      }
    } = this.props

    return (
      <Layout padding = { [0, 28, 112] }>
        <Panel
          title = { nickName }
          avatar = { avatarUrl }
          extra = { `已加入${ Object.keys(data).length }个小组` }
        />
        <List>
          <Item title = '我的信息' icon = 'i' to = '/' />
          <Item title = '我的小组' icon = 'team' to = '/' />
        </List>
        <Brand />
      </Layout>
    )
  }
}
