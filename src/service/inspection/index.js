import { http } from '@/utils/http'

// 本单位船只
export const shipList = (data) => {
  return http({
    url: '/sailingcheck/shipSailingRecord/shipList',
    method: 'GET',
    query: data,
  })
}

// 结束登船
export const shipLeave = (data) => {
  return http({
    url: `/sailingcheck/shipSailingRecord/leave`,
    method: 'POST',
    params: data, // 注意：POST 请求应该使用 params 传递参数
    data,
  })
}

// 结束下船
export const shipBack = (data) => {
  return http({
    url: `/sailingcheck/shipSailingRecord/back`,
    method: 'POST',
    params: data, // 注意：POST 请求应该使用 params 传递参数
    data,
  })
}

// 详情
export const shipUsers = (data) => {
  return http({
    url: '/sailingcheck/shipSailingRecord/shipUsers',
    method: 'GET',
    query: data,
  })
}
