import _ from 'lodash'
import { setStorageSync, getStorageSync, removeStorageSync, clearStorage, clearStorageSync } from '@tarojs/taro'

/**
 * 封装的store方法
 */
class Store {
  /**
   * [设置一个缓存]
   * @param  {String|Object} key  [键 可以是对象]
   * @param  {any} data [值]
   * @return {void}
   */
  set = (key, data) => {
    if (_.isPlainObject(key)) {
      return Object.keys(key).map(k => {
        setStorageSync(k, key[k])
      })
    }

    return setStorageSync(key, data)
  }

  /**
   * [合并一个缓存]
   * @param  {String} key  [键]
   * @param  {any} data    [值]
   * @return {void}
   */
  merge = (key, data) => {
    const value = this.get(key) || {}

    return this.set(key, {
      ...value,
      ...data
    })
  }

  /**
   * [获取一个缓存]
   * @param  {String} key [键]
   * @return {any}        [数据]
   */
  get = (key) => {
    return getStorageSync(key)
  }

  /**
   * [删除一个缓存]
   * @param  {String} key [键]
   * @return {void}
   */
  remove = (key) => {
    return removeStorageSync(key)
  }

  /**
   * [删除所有的缓存]
   * @return {void}
   */
  clear = () => {
    return clearStorageSync()
  }
}

let _store = null

function getStore () {
  if (!_store) {
    _store = new Store()

    return _store
  }

  return _store
}

export default getStore()
