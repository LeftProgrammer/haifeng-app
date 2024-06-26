import { http } from '@/utils/http'

// 获取人员
export const getAllPerson = (data) => {
  return http({
    url: '/personmanagement/personInfo/listNoPage',
    method: 'GET',
    data,
  })
}
