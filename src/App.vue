<style lang="less">
  @import "./colorui/app.less";
</style>
<script>

import Vue from 'vue'

export default {
  mpType: 'app',
  data () {
    return {
      isShow: true
    }
  },
  onLaunch () {
    uni.getNetworkType({
      success: function (res) {
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        if (res.networkType === 'none') {
          // 当前是否有网络连接
          Vue.prototype.alert('无法连接到网络，请您检查网络配置')
        }
      }
    })
    uni.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        Vue.prototype.alert('无法连接到网络，请您检查' + (res.networkType === 'none' ? '网络' : res.networkType) + '配置')
      }
    })
  },
  onShow () {
    try {
      let { model, screenHeight, statusBarHeight } = uni.getSystemInfoSync()
      // 判断 iphone X
      const iphoneX = /iphone x/i.test(model)
      const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812
      this.isIPhoneX = iphoneX || iphoneNew
      this.screenHeight = screenHeight
      // 胶囊的位置和大小
      var isSupport = !!uni.getMenuButtonBoundingClientRect
      var custom = isSupport ? uni.getMenuButtonBoundingClientRect() : null
      Vue.prototype.Custom = custom
      // 状态栏高度
      Vue.prototype.StatusBar = statusBarHeight
      // 判断头部的高度
      let height = custom ? custom.bottom + custom.top - statusBarHeight : 64
      Vue.prototype.CustomBar = height < 50 ? statusBarHeight + custom.bottom + custom.top : height
    } catch (err) {
      console.log(err)
    }
    // 检测小程序版本更新
    const updateManager = uni.getUpdateManager()
    if (updateManager) {
      updateManager.onCheckForUpdate((res) => {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          // 监听小程序有版本更新事件
          updateManager.onUpdateReady(() => {
            this.alert('新版本已经准备好，重新启动吧！', {
              title: '更新提示',
              done () {
                // 新的版本下载完毕，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            })
          })
          // 监听小程序更新失败事件
          updateManager.onUpdateFailed(() => {
            // 新版本下载失败
            this.alert('请在微信 “发现-小程序” 页删除当前小程序，重新通过小程序名称搜索打开使用最新版本', {title: '已经有新版本咯~'})
          })
        }
      })
    }
  },
  // 调用小程序分享接口
  onShareAppMessage () {
  },
  onPageNotFound (res) {
  }
}
</script>
