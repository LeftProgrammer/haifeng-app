import { http } from '@/utils/http'

// 获取避风报备
export const getwindShelter = (data) => {
  return http({
    url: `/windmanagement/windReport/getRecentReport`,
    method: 'GET',
    params: data,
  })
}
