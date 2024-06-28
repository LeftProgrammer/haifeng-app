import { http } from '@/utils/http'

// 获取待办
export const list = (data) => {
  return http({
    url: `/windmanagement/windNotifRecord/getListByLoginUser`,
    method: 'GET',
    query: data,
  })
}
// 删除待办
export const remove = (data) => {
  return http({
    url: `/windmanagement/windNotifRecord/delete`,
    method: 'DELETE',
    query: data,
  })
}
