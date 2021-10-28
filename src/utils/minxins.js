let MyPlugin = {}
MyPlugin.install = function (Vue) {
  // 添加全局方法或属性
  Vue.prototype.$isPage = function isPage() {
    return this.$mp && this.$mp.mpType === 'page'
  }
  // 注入组件
  Vue.mixin({
    data() {
      return {
        timer: null,
        isIPhoneX: this.isIPhoneX,
        isShow: false
      }
    },
    mounted() {
      if (this.isShow) return
      if (this.$isPage()) {
        let { model, screenHeight, statusBarHeight } = uni.getSystemInfoSync()
        // 判断 iphone X
        const iphoneX = /iphone x/i.test(model)
        const iphoneNew = /iPhone11/i.test(model) && screenHeight === 812
        this.isIPhoneX = iphoneX || iphoneNew
        this.screenHeight = screenHeight
      }
    },
    onUnload() {
      this.isShow = false
      if (typeof this.$options.data === 'function') {
        try {
          let { $data, $options, $vnode } = this
          if ($vnode) return
          Object.assign($data, $options.data())
        } catch (e) {
          console.log(e)
        }
      }
    }
  })
}
export default MyPlugin