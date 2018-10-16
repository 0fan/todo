/**
 * [getSetting 获取微信权限 默认userInfo权限]
 * @param  {String} type [权限类别]
 * @return {boolean}
 */
export function getSetting (type = 'userInfo') {
  return new Promise ((resolve, reject) => {
    wx.getSetting({
      success: ({ authSetting }) => resolve(authSetting[`scope.${ type }`] ? true : false),
      fail: err => resolve(false)
    })
  })
}

/**
 * [getUserInfo 获取微信个人信息]
 * @return {Object} [微信的用户信息]
 */
export function getUserInfo () {
  return new Promise((resolve, reject) => {
    wx.getUserInfo({
      success: ({ userInfo }) => resolve(userInfo),
      fail: err => resolve(null)
    })
  })
}

/**
 * [getCode 获取微信登陆临时凭证]
 * @return {String} [code]
 */
export function getCode () {
  return new Promise((resolve, reject) => {
    wx.login({
      success: ({ code }) => resolve(code),
      fail: err => resolve(null),
    })
  })
}

/**
 * [checkSession]
 * 检测当前用户登录态是否有效
 * 如果过期调用getCode从新登录
 * 这个接口暂时没用
 * @return {[err, res]}
 */
export function checkSession () {
  return new Promise((resolve, reject) => {
    wx.checkSession({
      success: res => resolve([null, res]),
      fail: err => resolve([err || '请求失败']),
    })
  })
}

/**
 * [showModal 提示模态框]
 * @return {Boolean}
 */
export function showModal ({
  title = '提示',

  ...rest
}) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title,
      ...rest,
      success: ({ confirm }) => resolve(confirm),
      fail: () => resolve(false),
    })
  })
}

/**
 * [showToast 提示]
 * @return {Boolean}
 */
export function showToast ({
  title = '提示',
  icon = 'none',
  duration = 2000,

  ...rest
}) {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title,
      icon,
      duration,
      ...rest,
      success: (res) => resolve(res || true),
      fail: () => resolve(false),
    })
  })
}

/**
 * [hideToast 提示]
 * @return {Boolean}
 */
export function hideToast () {
  return new Promise((resolve, reject) => {
    wx.hideToast({
      success: (res) => resolve(res || true),
      fail: () => resolve(false),
    })
  })
}

/**
 * [showLoading 提示]
 * @return {Boolean}
 */
export function showLoading ({
  title = '加载中',
  mask = true,

  ...rest
}) {
  return new Promise((resolve, reject) => {
    wx.showLoading({
      title,
      mask,

      ...rest,

      success: (res) => resolve(res || true),
      fail: () => resolve(false),
    })
  })
}

/**
 * [hideLoading 提示]
 * @return {Boolean}
 */
export function hideLoading () {
  return new Promise((resolve, reject) => {
    wx.hideLoading({
      success: (res) => resolve(res || true),
      fail: () => resolve(false),
    })
  })
}
