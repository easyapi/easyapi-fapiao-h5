import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const setting = {
  /**
   * 查询设置信息
   *
   * @see https://www.easyapi.com
   */
  findSetting(params: any): Promise<any> {
    return request.get('/setting/find', {
      params: {
        accessToken: localStorage.get('accessToken'),
        ...params,
      },
    })
  },
}

export default setting
