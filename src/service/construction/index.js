import { http } from '@/utils/http'

// 施工路由
export const constructionList = (data) => {
  return http({
    url: '/construction/constructionLog/report',
    method: 'GET',
    query: data,
  })
}
// 工序列表
export const constructionQueryList = (data) => {
  return http({
    url: '/construction/constructionLog/queryList',
    method: 'GET',
    query: data,
  })
}
// 填报

export const constructionAddList = (data) => {
  return http({
    url: '/construction/constructionLog/addList',
    method: 'POST',
    params: data,
    data,
  })
}
