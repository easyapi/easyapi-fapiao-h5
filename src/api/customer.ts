import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const customer = {
  /**
   * 获取我的客户信息
   *
   * @see https://www.easyapi.com
   */
  getCustomer(params: any): Promise<any> {
    return request.get('/customer', {
      params: {
        accessToken: localStorage.get('accessToken'),
        taxNumber: localStorage.get('taxNumber'),
        ...params,
      },
    })
  },
}

export default customer
