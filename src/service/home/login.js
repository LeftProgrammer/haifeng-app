import { http } from '@/utils/http'

/** POST 请求 */
export const postFooAPI = (data) => {
  return http.post('/foo', data, data)
}
