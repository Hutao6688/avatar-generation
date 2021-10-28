<template>
	<div>
		<div class="cu-custom" :style="[{'min-height':customHeight || CustomBar + 'px'}]">
			<div class="cu-bar fixed" :style="style" :class="[bgImage!=''?'none-bg text-white bg-img':'',bgColor]">
				<div class="action" v-if="isBack">
					<text class="iconfont iconjiantou_zuo back-page" @click="BackPage" v-if="isPrevious"></text>
					<text class="iconfont iconshouye2" @click="ToHome" v-if="isHome"></text>
					<text class="iconfont iconloading" v-if="isLoad"></text>
					<slot name="backText"></slot>
				</div>
				<div class="action" v-else>
					<slot name="backBox"></slot>
				</div>
				<div class="content" :style="[{top:StatusBar + 'px', 'font-weight': fontWeight}]">
					<slot name="content"></slot>
				</div>
				<slot name="right"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		data () {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				index: 0
			};
		},
		name: 'cu-custom',
		mounted () {
			this.getHeight()
		},
		computed: {
			style () {
				if (!this.StatusBar || !this.CustomBar || this.CustomBar < 60) {
					this.getHeight()
				}
				var StatusBar = this.StatusBar;
				var CustomBar = this.CustomBar;
				var bgImage = this.bgImage;
				var style = `min-height:${CustomBar}px;padding-top:${StatusBar}px;`;
				if (this.bgImage) {
					style = `${style}background-image:url(${bgImage});`;
				}
				return style
			}
		},
		props: {
			bgColor: {
				type: String,
				default: 'bg-gradual-white'
			},
			isHome: {
				type: [Boolean, String],
				default: false
			},
			isLoad: {
				type: [Boolean, String],
				default: false
			},
			isBack: {
				type: [Boolean, String],
				default: false
			},
			isPrevious: {
				type: [Boolean, String],
				default: true
			},
			customHeight: {
				type: [Number, String],
				default: ''
			},
			bgImage: {
				type: String,
				default: ''
			},
			fontWeight: {
				type: [String, Number],
				default: 'blod'
			},
			backUrl: {
				type: String,
				default: ''
			}
		},
		methods: {
			getHeight () {
				try {
					this.index += 1
					let { model, statusBarHeight } = uni.getSystemInfoSync()
					// 胶囊的位置和大小
					var isSupport = !!uni.getMenuButtonBoundingClientRect
					var custom = isSupport ? uni.getMenuButtonBoundingClientRect() : null
					if (custom && custom.bottom && custom.top) {
						this.index = 0
						this.Custom = custom
						// 状态栏高度
						this.StatusBar = statusBarHeight
						// 判断头部的高度
						let height = custom.bottom + custom.top - statusBarHeight
						this.CustomBar = height < 50 ? statusBarHeight + custom.bottom + custom.top : height
					} else {
						if (this.index > 10) return
						this.getHeight()
					}
				} catch (err) {
					console.log(err)
				}
			},
			BackPage() {
				uni.timer && clearTimeout(uni.timer)
				if (getCurrentPages().length < 2 && 'undefined' !== typeof __wxConfig) {
					let url = this.backUrl ? this.backUrl : '/' + __wxConfig.pages[0]
					return uni.redirectTo({url})
				}
				uni.navigateBack({
					delta: 1
				});
			},
			ToHome() {
				uni.reLaunch({url: '/pages/home/main'})
			}
		}
	}
</script>