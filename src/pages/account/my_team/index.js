import Taro, { Component } from '@tarojs/taro'
import { connect } from '@tarojs/redux'
import { View, Button, Text } from '@tarojs/components'

import Layout from '../../../component/layout'
import Panel from '../../../component/panel'
import Card from '../../../component/card/teamCard'

import './index.less'

@connect(state => ({
  user: state.user,
  team: state.team,
}), dispatch => ({}))
export default class Page extends Component {
  config = {
    navigationBarTitleText: '我的小组',
    backgroundColor: '#eee',
    enablePullDownRefresh: true,
  }

  render () {
    const {
      user: {
        nickName,
        currentTeamId,
        LIMIT_TEAM
      },
      team: {
        data
      }
    } = this.props

    const listData = Object.keys(data)

    return (
      <Layout padding = { [0, 0, 48] }>
        <Panel title = { nickName }>
          每人最多存在于{ LIMIT_TEAM }个小组
        </Panel>

        <Layout padding = { [14, 36, 0] }>
          {
            listData.map((k, i) => {
              const v = data[k]

              return (
                <Card
                  title = { v.groupName }
                  member = { v.memberCount }
                  type = { v.groupType }
                  isCurrent = { v.id === currentTeamId }

                  to = { `/pages/account/my_team/team_detail/index?id=${ v.id }` }

                  key = { i }
                />
              )
            })
          }
          {
            listData.length < LIMIT_TEAM ?
              <Card isAdd to = '/pages/create_team/index' /> :
              null
          }
        </Layout>
      </Layout>
    )
  }
}
