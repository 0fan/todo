import { request } from '@tarojs/taro'

import qs from 'qs'

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
    header,
    data: qs.stringify(data),
    method: 'post',

    ...config,

    success: res  => {
      const {
        data,
        data: {
          code,
          message,
          object
        }
      } = res

      if (code !== 0) {
        return resolve([message || '请求失败'])
      }

      resolve([null, object])
    },
    fail: err => {
      resolve(['请求失败'])
    }
  })
})
