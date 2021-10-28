import {RegYYYYMMDD} from './regs'
const dateFormat = (d, fmt) => {
  if (!d || !fmt) return ''
  // 转换毫秒和字符串为时间对象
  if (typeof d === 'string') {
    // 兼容ios和ie yyyy-MM-dd 转换时间为NaN
    d = new Date(d.replace(/-/g,"/"))
  }
  if (typeof d === 'number') {
    d = new Date(d)
  }
  // d是NaN的时候返回空
  if (isNaN(d)) return ''
  const o = {
    'M+': d.getMonth() + 1, // 月份
    'd+': d.getDate(), // 日
    'h+': d.getHours(), // 小时
    'm+': d.getMinutes(), // 分
    's+': d.getSeconds(), // 秒
    'q+': Math.floor((d.getMonth() + 3) / 3), // 季度
    'S': d.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? '000' : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
const datePlus24 = (time) => {
  let hour = 3600000
  // 如果当前时间是23点，返回时间增加48小时，否则增加24小时
  let day = hour * (dateFormat(time, 'hh') === '23' ? 48 : 24)
  return new Date(time + day)
}
// 20191010 => 2019-10-10
const dateTransform = (str) => {
  if (typeof str === 'string' && str.length === 8) {
    let y = str.slice(0, 4)
    let m = str.slice(4, 6)
    let d = str.slice(6, 8)
    return `${y}-${m}-${d}`
  } else {
    return Date.now()
  }
}

const dateGetTime = (str) => {
  let d = RegYYYYMMDD.test(str) ? new Date(str.replace(/-/g,"/")) : new Date()
  return d.getTime()
}

export default {
  dateGetTime,
  dateFormat,
  datePlus24,
  dateTransform
}