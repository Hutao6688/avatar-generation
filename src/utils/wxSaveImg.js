/**
 *  获取相册权限
 */
export function wxSaveAuth() {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success(res) {
                if (!res.authSetting['scope.writePhotosAlbum']) {
                    // 如果没有写入权限，则获取写入相册权限
                    uni.authorize({
                        scope: 'scope.writePhotosAlbum',
                        success() {
                            resolve()
                        },
                        fail(err) {
                            reject(err)
                            // 用户拒绝授权
                            uni.showModal({
                                content: '检测到您没打开相册权限，是否去设置打开？',
                                confirmText: '确认',
                                cancelText: '取消',
                                success(res) {
                                    if (res.confirm) {
                                        uni.openSetting({
                                            success: res => {}
                                        })
                                    }
                                }
                            })
                        }
                    })
                } else {
                    resolve()
                }
            },
            fail(e) {
                reject(e)
            }
        })
    })
  }