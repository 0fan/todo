import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'

import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from '@tarojs/redux'

import reducer from './model'

// global style
import './less/index.less'

const store = createStore(reducer, applyMiddleware(
  thunkMiddleware,
  // createLogger()
))

class App extends Component {

  config = {
    window: {
      navigationBarTitleText: '凸度',
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTextStyle: 'black'
    },
    pages: [
      'pages/auth/index',
      'pages/my_task/index',
      'pages/team_task/index',
      'pages/account/index',

      'pages/account/info/index',
      'pages/account/my_team/index',
      'pages/account/my_team/team_detail/index',

      'pages/task_detail/index',
      'pages/create_team/index',
      'pages/invite/index',

      // 'pages/auth/index',
    ],
    tabBar: {
      color: '#A9A9A9',
      selectedColor: '#257AFF',
      backgroundColor: '#fff',
      borderStyle: 'dark',

      list: [{
        text: '任务',
        pagePath: 'pages/my_task/index',
        iconPath: './asset/img/nav_i_n.png',
        selectedIconPath: './asset/img/nav_i_h.png',
      }, {
        text: '小组',
        pagePath: 'pages/team_task/index',
        iconPath: './asset/img/nav_team_n.png',
        selectedIconPath: './asset/img/nav_team_h.png',
      }, {
        text: '我的',
        pagePath: 'pages/account/index',
        iconPath: './asset/img/nav_account_n.png',
        selectedIconPath: './asset/img/nav_account_h.png',
      }]
    },
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Provider store = { store } />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
