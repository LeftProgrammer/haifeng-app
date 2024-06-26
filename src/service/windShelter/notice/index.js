import { http } from '@/utils/http'

// 获取最近一个月的通知
export const noticeList = (data) => {
  return http({
    url: '/windmanagement/windNotification/getRecentNotify',
    method: 'GET',
    data,
  })
}

// 添加
export const noticeAdd = (data) => {
  return http({
    url: `/windmanagement/windNotification/add`,
    method: 'POST',
    data,
  })
}
export const noticeEdit = (data) => {
  return http({
    url: `/windmanagement/windNotification/edit`,
    method: 'PUT',
    data,
  })
}
export const noticeRelease = (data) => {
  return http({
    url: `/windmanagement/windNotification/release`,
    method: 'PUT',
    data,
  })
}
export const noticeSetEnd = (data) => {
  return http({
    url: `/windmanagement/windNotification/setEnd`,
    method: 'PUT',
    data,
  })
}
