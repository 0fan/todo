import { request, reLaunch } from '@tarojs/taro'
import store from '../util/store'
import { showModal } from '../util/wx'

import qs from 'qs'

import { _url, api } from '../config/api'

const header = {
  'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
}

export function setHeader (value, key) {
  header[key] = value
}

export function setToken (value) {
  setHeader(value, 'token')
}

/**
 * [封装的请求方法]
 * @param  {String} url    [请求地址]
 * @param  {Object} data   [数据]
 * @param  {Object} config [header]
 * @return {[err, res]}    [返回结果]
 */
export default (
  url,
  data = {},
  config = {}
) => new Promise((resolve, reject) => {
  request({
    url,
    data: qs.stringify(data),
    header,
    method: 'post',

    ...config,

    success: async res  => {
      const {
        data,
        data: {
          code,
          message,
          object
        }
      } = res

      if (code === -2) {
        store.clear()

        // 过滤掉formid接口
        if (url !== _url.server + api.saveFormId) {
          const sure = await showModal({
            showCancel: false,
            content: '登录失效或未登录,将重新登录',
            confirmText: '确定',
          })

          reLaunch({
            url: '/pages/auth/index'
          })
        }

        return resolve([message || '请求失败'])
      }

      if (code !== 0) {
        return resolve([message || '请求失败'])
      }

      resolve([null, object])
    },
    fail: err => {
      console.log(err)
      resolve(['请求失败'])
    }
  })
})
