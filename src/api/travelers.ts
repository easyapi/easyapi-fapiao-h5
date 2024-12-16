import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const travelers = {
  /**
   * 获取出行人信息
   * @see https://www.easyapi.com
   */
  getTravelers(params): Promise<any> {
    return request.get('/user/travelers', {
      params: {
        accessToken: localStorage.get('accessToken'),
        ...params,
      },
    })
  },

  /**
   * 删除出行人信息
   * @see https://www.easyapi.com
   */
  deleteTravelers(id: any): Promise<any> {
    return request.delete(`/traveler/${id}`, {
      params: {
        accessToken: localStorage.get('accessToken'),
      },
    })
  },

  /**
   * 获取默认参数信息
   */
  findFieldKeyList(params: any): Promise<ApiResponse> {
    params.size = 100
    return request.get(`/setting/find`, {
      params: {
        accessToken: localStorage.get('accessToken'),
        ...params,
      },
    })
  },

}

export default travelers
