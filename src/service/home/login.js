import { http } from '@/utils/http'

export const login = (data) => {
  return http({
    url: `/sys/login`,
    method: 'POST',
    params: data, // 注意：POST 请求应该使用 params 传递参数
    data,
  })
}

export const queryByUsername = (data) => {
  return http({
    url: `/personmanagement/personInfo/queryByUsername
`,
    method: 'GET',
    query: data,
  })
}
