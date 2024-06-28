import { http } from '@/utils/http'
// 登录
export const login = (data) => {
  return http({
    url: `/sys/login`,
    method: 'POST',
    data,
  })
}
// 获取人员
export const queryByUsername = (data) => {
  return http({
    url: `/person/personInfo/queryByUsername`,
    method: 'GET',
    data,
  })
}

// 天气
export const getRealTimeWeather = (data) => {
  return http({
    url: `/dashboard/information/getRealTimeWeather`,
    method: 'GET',
    data,
  })
}
// 气象预警
export const getExtremeWeather = (data) => {
  return http({
    url: `/dashboard/information/getExtremeWeather`,
    method: 'GET',
    data,
  })
}
// 避风通知
export const windnotifycation = (data) => {
  return http({
    url: `/dashboard/information/windnotifycation`,
    method: 'GET',
    data,
  })
}
// 围栏警告
export const getShipAlarm = (data) => {
  return http({
    url: `/dashboard/information/getShipAlarm`,
    method: 'GET',
    data,
  })
}
