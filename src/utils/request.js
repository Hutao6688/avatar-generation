import Vue from 'vue'
// 定义全局变量
let that = Vue.prototype

const appid = 'wxa709859a8764e852'

// 请求主域名
const domain = 'u-bx.com'
// 测试环境
// const APP_ENV = 'api-uat'
// 自动化环境
const APP_ENV = {
  'development': 'api-dev',
  'qa': 'api-qa',
  'release': 'api-uat',
  'pro': 'api',
  'production': 'api'
}[process.env.NODE_ENV]

const H5_DEV = {
  'development': 'dev',
  'qa': 'qa',
  'release': 'uat',
  'pro': 'trade',
  'production': 'trade'
}[process.env.NODE_ENV]
// 生产环境
// const APP_ENV = 'api'
const YjDomain = `https://${APP_ENV}.${domain}/`
// 获取头部信息
const getHeader = (head) => {
  const header = head || { 'content-type': 'application/json' }
  const Token = uni.getStorageSync('yj_token')
  const CityName = encodeURIComponent(uni.getStorageSync('yj_city_name')) || ''
  const CityCode = uni.getStorageSync('yj_city_code') || ''
  return Object.assign(header, {
    Appid: appid,
    Application: 'mpCarInsurance',
    Authorization: Token,
    CityCode,
    CityName,
    Token
  })
}
// 获取请求status状态
const getStatus = (status, url) => {
  let bool = false
  // 如果状态是401 重新登录
  if (status === 401) {
    uni.removeStorageSync('yj_token')
    let page = getCurrentPages()[0]
    // 判断页面参数
    let params = ''
    if (page) {
      let option = []
      for (const key in page.options) {
        option.push(key + '=' + page.options[key])
      }
      params = '?' + option.join('&')
    }
    that.login((code) => {
      // 判断用户是否注册
      if (code.id && page.route !== 'pages/home/main') {
        uni.reLaunch({ url: '/' + (page.route) + params })
      }
    })
    bool = true
  }
  return bool
}
const getUrl = (url, version) => {
  let domain = YjDomain
  return url.indexOf('http') > -1 ? url : domain + url
}
// 主方法
const baseQuery = ({ method, url, head, version, data, done, fail, timeOut, isHideLoading }) => {
  let connect = false
  let timer = setTimeout(() => {
    if (connect) {
      clearTimeout(timer)
    } else {
      clearTimeout(timer)
      that.alert('请求网络超时，请您检查网络')
      requestTask.abort()
    }
  }, timeOut || 60000)
  let requestTask = uni.request({
    url: getUrl(url, version),
    data: data,
    method: method,
    header: getHeader(head),
    success: (rsp) => {
      connect = true
      uni.hideLoading({fail: () => {}})
      let {data, statusCode, header} = rsp
      if (header['X-Auth-Token']) {
        uni.setStorageSync('yj_token', header['X-Auth-Token'])
      }
      // 判断token过期-401
      if (getStatus(statusCode, url)) {
        fail && fail(data)
      // 兼容之前的老代码
      } else if (data.resultCode === 1 || data.code === 0 || (url.indexOf('checkPass') >= 0)) {
        done && done(data)
      // 如果data为null 返回fail
      } else if (data.data === null) {
        fail && fail(data)
      } else {
        data.msg = data.message || data.msg
        fail && fail(data)
      }
    },
    fail: () => {
      connect = true
      uni.hideLoading({fail: () => {}})
      that.aldEvent('请求接口失败，网络超时', {url});
      fail && fail({code: -1, msg: '请求网络超时，请您稍后重试'})
    }
  })
  return requestTask
}
// get方法
const get = ({ url, head, version, data, done, fail, timeOut }) => {
  return baseQuery({ method: 'GET', url, head, version, data, done, fail, timeOut })
}
// post方法
const post = ({ url, head, version, data, done, fail, timeOut, isHideLoading }) => {
  return baseQuery({ method: 'POST', url, head, version, data, done, fail, timeOut, isHideLoading })
}
// 上传方法
const upload = ({ url, version, filePath, fileName, formData, done, fail }) => {
  formData = formData || {}
  return uni.uploadFile({
    url: getUrl(url, version),
    filePath,
    formData,
    name: fileName,
    header: {
      // yj_token 需要修改自己的token
      Authorization: uni.getStorageSync('yj_token'),
      Token: uni.getStorageSync('yj_token')
    },
    success: function (rsp) {
      uni.hideLoading({fail: () => {}})
      let {data, statusCode} = rsp
      data = JSON.parse(data)
      // statusCode是502、401 返回失败
      if (getStatus(statusCode)) {
        fail && fail({msg: '网络貌似出了点问题'})
      } else if (data.code === 0) {
        done && done(data)
      } else {
        fail && fail(data)
        if (APP_ENV !== 'api') {
          that.alert(data.msg)
        }
      }
    },
    fail: (err) => {
      uni.hideLoading({fail: () => {}})
      console.error(err)
    }
  })
}

export default {
  H5_DEV,
  APP_ENV,
  appid,
  get,
  post,
  upload,
  getUrl
}
