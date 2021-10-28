<style lang="less">
@import "./index.less";
</style>
<template>
  <div class="wrapper">
    <cu-custom :isBack="true" bgColor="none-bg text-white bg-img">
      <block slot="content">裁剪</block>
    </cu-custom>
    <!-- limit_move限制图片移动范围 -->
    <!-- disable_rotate禁止用户旋转 -->
    <!-- disable_width锁定裁剪框宽度 -->
    <!-- disable_height锁定裁剪框高度 -->
    <!-- disable_ratio锁定裁剪框比例 -->
    <image-cropper id="image-cropper"
      :limit_move="true"
      :disable_rotate="true"
      :disable_width="true"
      :disable_height="true"
      :disable_ratio="true"
      :width="width"
      :height="height"
      :imgSrc="src"
      @imageload="loadimage"
      @tapcut="clickcut">
    </image-cropper>
    <div class="bottom">
      <button @click="quxiao" class="cu-btn round action-btn">取消</button>
      <button @click="submit" class="cu-btn round action-btn btn-primary">确定</button>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {
      src: '',
      width: 250, //宽度
      height: 250, //高度
    };
  },
  onLoad(data) {
    //获取到image-cropper实例
    this.cropper = this.selectComponent('#image-cropper')
    //开始裁剪
    this.src = data.tempFilePath;
    wx.showLoading({
      title: '加载中',
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  methods: {
    loadimage(e) {
      wx.hideLoading()
      //重置图片角度、缩放、位置
      this.cropper.imgReset()
    },
    clickcut(e) {
      wx.previewImage({
        // 当前显示图片的http链接
        current: e.detail.url,
        // 需要预览的图片http链接列表
        urls: [e.detail.url]
      })
    },
    //点击提交按钮时触发
    submit() {
      this.cropper.getImg((obj) => {
        wx.navigateTo({
          //跳回pageA页面，将裁剪好的图片显示在pageA的image标签上
          url: '/pages/flag/guoqing/main?cropperPath=' + obj.url,
        })
        console.log('obj', obj)
      })
    },
    quxiao() {
      wx.navigateBack({
        delta: -1,
      })
    }
  }
};
</script>