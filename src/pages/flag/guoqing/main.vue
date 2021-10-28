<style lang="less">
@import "./index.less";
</style>
<template>
  <div class='wrapper'>
    <div class="container">
      <img class="page-bg" mode="widthFix" :src="bgImage">
      <div class="avatar-container" id="avatar-container" :style="[{'margin-top':showHeight +'px'}]">
        <div class="xiangji-icon" v-if="avatarImage">
          <span class="iconfont iconxiangji2" @click="chooseImage"></span>
        </div>
        <img class="avatar-img" id="avatar-img" :src="avatarImage" />
        <img class="avatar-frame" :src="frameImage" v-if="currentFrame" />
        <div class="empty-avatar-view" v-if="!avatarImage">
          <img class="empty-avatar" src="/static/image/avatar_empty.svg" />
          <button class="cu-btn round action-btn" @click="getUserProfile" id="btn-choose-img">获取头像</button>
        </div>
        <p class="prev" @click="cutover(0)"><span class="iconfont iconqianfanicon"></span></p>
        <p class="next" @click="cutover(1)"><span class="iconfont iconhoufanicon"></span></p>
      </div>
      <div>
        <canvas canvasId="canvas" class="canvas"></canvas>
      </div>
      <div class="panel assets-container">
        <div clss="category-list" style="display:flex">
          <div v-for="(item, index) in categoryList" :key="index">
            <text :class="['category ',item.id===currentCategory?'active':'']" data-categroy-id="item.id" @click="changeCategory(item.id)">{{item.name}}</text>
          </div>
        </div>
        <scroll-view class="assets-scroll-view" :scroll-into-view="bottomId" scrollX="true">
          <div :id="'img' + index" class="assets" :class="[index === savedNum && avatarImage ? 'active-border' : '']" v-for="(item, index) in imageList" :key="index">
            <img @click="changeAsset(imageList, index)" :src="item.src" />
          </div>
        </scroll-view>
      </div>
      <div class="flex justify-around">
        <button class="cu-btn round action-btn" @click="share" openType="share" id="btn-choose-img">分享给朋友</button>
        <button class="cu-btn round action-btn btn-primary" @click="draw" id="btn-save">保存到相册</button>
      </div>
      <div class="ad-container">
        <div binderror="__e" bindload="__e" unitId="adunit-43f7c4189a8e7c35"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { wxSaveAuth } from "@/utils/wxSaveImg";
import { random } from "@/utils/random";
export default {
  data() {
    return {
      bgImage: "https://oss-img.gaocaipeng.com/guoqi/bg_image.jpg",
      title: ["🎃 换头像，做靓仔", "🎃 万圣节一起来扮鬼，换个头像做票圈最靓的仔", "🎃 万圣节让我们嗨起来", "🎃 要做就做最帅的那一个", "🎃 今晚我会半夜来敲门"],
      showHeight: 220,
      avatarUrl: "",
      subscribe: true,
      savedNum: 0,
      cansWidth: 280,
      cansHeight: 280,
      avatarImage: "",
      currentFrame: {},
      bottomId: null,
      currentCategory: "wanshengjie",
      categoryList: [
        {
          id: "wanshengjie",
          name: "万圣节"
        },
        {
          id: "kaTongWanshengjie",
          name: "卡通万圣节"
        },
        {
          id: "sanDWanshengjie",
          name: "3D万圣节"
        },
        // {
        //   id: "hongqi",
        //   name: "红旗",
        // },
        // {
        //   id: "zhounian",
        //   name: "72周年",
        // },
        // {
        //   id: "guoqing",
        //   name: "国庆",
        // },
        // {
        //   id: "qingshuang",
        //   name: "清爽",
        // },
        // {
        //   id: "qita",
        //   name: "其他",
        // },
      ],
      assetsList: {
        wanshengjie: [
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie05.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie06.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie07.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie08.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie16.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie15.png"}
        ],
        kaTongWanshengjie: [
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie01.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie02.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie03.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie04.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie18.png"}
        ],
        sanDWanshengjie: [
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie17.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie19.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie20.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie21.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie09.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie10.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie11.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie12.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie13.png"},
          {src: "https://oss-img.gaocaipeng.com/guoqi/img/wanshengjie/wanshengjie14.png"},
        ],
        hongqi: [
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat25.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat26.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat0.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat24.png" },
        ],
        zhounian: [
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat19.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat7.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat20.png" },
        ],
        qingshuang: [
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat2.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat3.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat27.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat4.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat28.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat6.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat29.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat30.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat12.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat14.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat22.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat23.png" },
        ],
        guoqing: [
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat8.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat9.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat16.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat17.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat13.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat18.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat11.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat10.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat15.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat21.png" },
        ],
        qita: [
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat5.png" },
          { src: "https://oss-img.gaocaipeng.com/guoqi/img/hat1.png" },
        ],
      },
    };
  },
  onLoad(data) {
    //开始裁剪
    if (data.cropperPath) {
      this.avatarImage = data.cropperPath;
      // 默认选择新款下的第一张挂件
      this.changeAsset(this.assetsList.wanshengjie, 0);
    }
  },
  computed: {
    frameImage: function() {
      if (this.currentFrame.src) {
        var e = this.currentFrame.src;
        return console.log("frameImage:" + e), e;
      }
    },
    imageList: function() {
      return this.assetsList[this.currentCategory];
    },
  },
  mounted () {
    let that = this;
    uni.getSystemInfo({
      success(res) {
        let screHeight = res.screenHeight
        console.log(res)
        if (screHeight >= 736) {
          let statusBarHeight = res.statusBarHeight
          let isSupport = !!uni.getMenuButtonBoundingClientRect
          let custom = isSupport ? uni.getMenuButtonBoundingClientRect() : null
          let height = custom.bottom + custom.top - statusBarHeight
          let CustomBar = height < 50 ? statusBarHeight + custom.bottom + custom.top : height
          let width = res.windowWidth
          let scale = width / 375
          that.showHeight = (scale * 340) - CustomBar
        } else if (screHeight > 640 && screHeight < 736) {
          that.showHeight = 240
        } else if (screHeight > 600 && screHeight <= 640) {
          that.showHeight = 210
        } else {
          that.showHeight = 140
        }
      }
    })
  },
  methods: {
    // 点击微信授权按钮回调
    getUserProfile(e) {
      wx.getUserProfile({
        desc: "生成用户头像图片需要",
        success: (res) => {
          let data = res.userInfo;
          this.avatarUrl = data.avatarUrl.replace("/132", "/0");
          this.avatarImage = this.avatarUrl;
          // 默认打开某个分类的第一张图
          this.changeAsset(this.assetsList.wanshengjie, 0);
        },
      });
    },
    // 清空
    reset() {
      this.avatarImage = "";
    },
    // 上传图片
    chooseImage() {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (e) => {
          var t = e.tempFilePaths[0];
          if (t) {
            // 跳转去裁剪
            uni.navigateTo({
              url: "/pages/flag/crop/main?tempFilePath=" + t
            });
          }
          // 不去裁剪
          // this.avatarImage = t;
        },
      });
    },
    // 选择分类
    changeCategory(id) {
      if (!this.avatarImage) {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      this.currentCategory = id;
      this.savedNum = 0;
      this.changeAsset(this.assetsList[id], 0);
    },
    // 左右切换
    cutover(type) {
      if (!this.avatarImage) {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
          duration: 2000,
        });
        return;
      }
      if (type) {
        if (this.savedNum < this.imageList.length - 1) {
          this.savedNum += 1;
          this.currentFrame = this.imageList[this.savedNum];
          this.bottomId = "img" + this.savedNum;
        } else {
          uni.showToast({
            title: "已经是最后一张",
            icon: "none",
            duration: 2000,
          });
        }
      } else {
        if (this.savedNum) {
          this.savedNum -= 1;
          this.currentFrame = this.imageList[this.savedNum];
          this.bottomId = "img" + this.savedNum;
        } else {
          uni.showToast({
            title: "已经是第一张",
            icon: "none",
            duration: 2000,
          });
        }
      }
    },
    // 选择挂件
    changeAsset(data, index) {
      if (this.avatarImage) {
        this.savedNum = index;
        this.currentFrame = data[index];
      } else {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
          duration: 2000,
        });
      }
    },
    draw() {
      console.log("绘制头像");
      var a = this;
      if (a.avatarImage) {
        var t = wx.createSelectorQuery();
        t.select("#avatar-img").boundingClientRect();
        t.exec(function(t) {
          var r = wx.createCanvasContext("canvas");
          r.clearRect(0, 0, a.cansWidth, a.cansHeight);
          uni.getImageInfo({
            src: a.avatarImage,
            success: function(res) {
              r.drawImage(res.path, 0, 0, a.cansWidth, a.cansHeight);
              uni.getImageInfo({
                src: a.frameImage,
                success: function(res) {
                  r.drawImage(res.path, 0, 0, a.cansWidth, a.cansHeight);
                  r.draw();
                  setTimeout(() => {
                    a.saveCans();
                  }, 100);
                }
              });
            }
          });
        });
      } else {
        uni.showToast({
          title: "请先上传图片",
          icon: "none",
          duration: 2000,
        });
      }
    },
    share() {
      uni.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage", "shareTimeline"],
      });
    },
    // 保存到相册
    saveCans() {
      var a = this;
      uni.showLoading({
        title: "保存...",
        mask: !0,
      });
      uni.canvasToTempFilePath(
        {
          x: 0,
          y: 0,
          height: this.cansWidth,
          width: this.cansHeight,
          destWidth: 3 * this.cansWidth,
          destHeight: 3 * this.cansHeight,
          canvasId: "canvas",
          success: function(t) {
            uni.hideLoading();
            wxSaveAuth().then((res) => {
              uni.saveImageToPhotosAlbum({
                filePath: t.tempFilePath,
                success(res) {
                  uni.showToast({
                    title: "保存图片成功",
                    icon: "success",
                    duration: 2000,
                  });
                },
                fail(res) {
                  uni.showToast({
                    title: "保存图片失败",
                    icon: "none",
                    duration: 2000,
                  });
                },
              });
            });
          },
          fail: function(a) {
            uni.hideLoading();
          },
        },
      );
    },
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: this.title[random(0,4)],
      imageUrl: "https://oss-img.gaocaipeng.com/guoqi/bg_image.jpg",
      path: "/pages/flag/guoqing/main"
    };
  },
  // 页面分享
  onShareAppMessage() {
    return {
      title: this.title[random(0,4)],
      imageUrl: "https://oss-img.gaocaipeng.com/guoqi/bg_image.jpg",
      path: "/pages/flag/guoqing/main"
    };
  },
};
</script>