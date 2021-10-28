import Vue from 'vue'
import App from './App'
import request from '@/utils/request'
import date from '@/utils/dateFormat'
import minxins from '@/utils/minxins'
// 导航组件
import cuCustom from '@/colorui/components/cu-custom'



Vue.use(minxins)
Vue.component('cu-custom', cuCustom)

Vue.config.productionTip = false
Vue.prototype.myType = 'app'
const app = new Vue(App)
app.$mount()
// 时间初始化
Vue.prototype.toast = (str, duration) => {
  uni.showToast({
    title: str,
    icon: 'none',
    duration: duration || 2000
  })
}
Vue.prototype.date = date
Vue.prototype.alert = (str, option) => {
  let msg = typeof str === 'object' ? JSON.stringify(str) : typeof str === 'string' ? str : ''
  let op = option || {}
  uni.showModal({
    title: op.title || '提示',
    content: msg,
    confirmText: op.confirmText || '确定',
    confirmColor: '#FF9902',
    cancelText: op.cancel || '取消',
    showCancel: !!op.cancel,
    success(rsp) {
      if (rsp.confirm) {
        op.done && op.done()
      } else if (rsp.cancel) {
        op.fail && op.fail()
      }
    }
  })
}
Vue.prototype.loading = (str) => {
  uni.showLoading({
    title: str,
    mask: true,
    complete: (data) => {
      console.log(data)
    }
  })
}
Vue.prototype.$subNum = (a, num) => {
  num = num || 2
  var type = typeof (a)
  let arr = []
  if (type === 'number') {
    var str = a.toString()
    arr = str.split('.')
  } else if (type === 'string') {
    arr = a.split('.')
  } else {
    a = 0
  }
  if (arr.length > 1) {
    a = arr[0] + '.' + arr[1].substr(0, num)
  }
  return isNaN(a) ? 0 : +a
}
Vue.prototype.$division = (a1, a2) => {
  let t1 = 0
  let t2 = 0
  let r1 = ''
  let r2 = ''
  if (typeof (a1) === 'number') {
    a1 = a1.toString()
  }
  if (typeof (a2) === 'number') {
    a2 = a2.toString()
  }
  try {
    t1 = a1.split('.')[1].length
  } catch (e) {}
  try {
    t2 = a2.split('.')[1].length
  } catch (e) {}
  r1 = a1 && Number(a1.replace('.', ''))
  r2 = a2 && Number(a2.replace('.', ''))
  return (r1 / r2) * Math.pow(10, t2 - t1)
}

Vue.prototype.$subFloat = (num) => {
  parseFloat(num / 100).toFixed(2)
}

Vue.prototype.$shareName = (name, num) => {
  let title = ''
  if (name.length + num <= 26) {
    title = name
  } else {
    // 名称最多26减去num减去...占位1
    title = name.substr(0, 25 - num) + '...'
  }
  return title
}

// 获取微信基础库版本，判断调用接口使用
Vue.prototype.SDKVersion = uni.getSystemInfoSync().SDKVersion || '0'
// 新增getUserProfile接口（基础库2.10.4版本开始支持） 2.10.3
// 是否请求最新api
// Vue.prototype.isNewVersion = Vue.prototype.compareVersion(Vue.prototype.SDKVersion, '2.10.3') > 0
Vue.prototype.isNewVersion = !!wx.getUserProfile
console.log(Vue.prototype.isNewVersion, Vue.prototype.SDKVersion, 'isReqV2')

Vue.prototype.request = request
// 时间组件
for (let i in date) {
  Vue.prototype[i] = date[i]
}