import { http } from '@/utils/http'

export const getDict = (data) => {
  return http({
    url: `/sys/dict/getDictItems/data_fan_info,fan_type,id`,
    method: 'GET',
    params: data,
  })
}
