import { showToast } from 'vant'

/**
 * 验证全电发票填开特定业务
 */
export function verificationSpecificBusiness(code: string, value: any) {
  // 旅客运输服务
  if (code === '09') {
    let stopLoop = false
    for (let index = 0; index < value.length; index++) {
      const item = value[index]
      if (!item.traveler) {
        showToast(`请输入出行人${index + 1}名称`)
        stopLoop = true
        break
      }
      if (!item.travelDate) {
        showToast(`请选择出行人${index + 1}出行日期`)
        stopLoop = true
        break
      }
      if (!item.idType) {
        showToast(`请选择出行人${index + 1}证件类型`)
        stopLoop = true
        break
      }
      if (!item.idNumber) {
        showToast(`请输入出行人${index + 1}证件号码`)
        stopLoop = true
        break
      }
      if (!item.travelDeparturePlace) {
        showToast(`请选择出行人${index + 1}出发地`)
        stopLoop = true
        break
      }
      if (!item.travelDestinationPlace) {
        showToast(`请选择出行人${index + 1}到达地`)
        stopLoop = true
        break
      }
      if (!item.vehicleType) {
        showToast(`请选择出行人${index + 1}交通工具类型`)
        stopLoop = true
        break
      }
      if ((item.vehicleType === 1 || item.vehicleType === 2 || item.vehicleType === 7) && !item.level) {
        showToast(`请选择出行人${index + 1}等级`)
        stopLoop = true
        break
      }
    }
    if (stopLoop)
      return false
  }
  return true
}
