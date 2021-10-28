// 验证双字节字符串
const RegDoubleByte = /[^\x00-\xff]/g
// 验证密码
const RegPassword = /(?!^\d+$)(?!^[A-Za-z]+$)(?!^_+$)^\w{6,20}$/
// 验证手机号
const RegPhone = /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/
// 验证邮箱
const RegEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
// 验证空格
const RegSpace = /(\s+)/g
// 验证验证码
const RegCode = /^[0-9]{6}?$/
// 时间格式校验 yyyy-mm-dd
var RegYYYYMMDD = /[\d]{4}[\/-]{1}[\d]{2}[\/-]{1}[\d]{2}/;
// 验证url
const RegUrl = /^(http[s]?:\/\/)([\S]*)$/
// 验证金额是否是正数，是否是两位小数
const RegAmount = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
// 验证银行卡
const RegBankNo = /^([1-9]{1})(\d{15}|\d{16}|\d{17}|\d{18})$/
// 验证车牌
const RegVehicleNo = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}([A-Z0-9]{4}|[A-Z0-9]{5})[A-Z0-9挂学警港澳]{1}$/
// 验证身份证号
const RegIdCardNo = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/
// 验证车架号
const RegVehicleFrameNo = /^[ABCDEFGHJKLMNPRSTUVXWYZ0-9]{17}?$/
// 验证营业执照
const RegBusinessLicense = /^[ABCDEFGHJKLMNPRTUQXWYZ0-9]{15,18}?$/
// 验证组织机构代码
const RegOrganizationCode = /.+/
// 验证是否为空对象
const isEmptyObject = (o) => {
  for (let t in o) {
    return false
  }
  return true
}
// 验证是否为空对象
let RegVIN = (vin) => {
  let obj = {
    '0': 0,
    '1': 1,
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    'A': 1,
    'B': 2,
    'C': 3,
    'D': 4,
    'E': 5,
    'F': 6,
    'G': 7,
    'H': 8,
    'J': 1,
    'K': 2,
    'L': 3,
    'M': 4,
    'N': 5,
    'P': 7,
    'R': 9,
    'S': 2,
    'T': 3,
    'U': 4,
    'V': 5,
    'W': 6,
    'X': 7,
    'Y': 8,
    'Z': 9
  }
  let arr = [8,7,6,5,4,3,2,10,0,9,8,7,6,5,4,3,2]
  let num = 0
  for (let i = 0; i < vin.length; i++) {
    let key = vin[i]
    console.log(key, obj[key] * arr[i])
    num += obj[key] * arr[i]
  }
  console.log(num)
  return parseInt(num/11)%11 === vin[8]
}

export {
  RegVehicleNo,
  RegDoubleByte,
  RegPassword,
  RegBankNo,
  RegSpace,
  RegEmail,
  RegPhone,
  RegCode,
  RegUrl,
  RegYYYYMMDD,
  isEmptyObject,
  RegVehicleFrameNo,
  RegAmount,
  RegIdCardNo,
  RegBusinessLicense,
  RegOrganizationCode
}
