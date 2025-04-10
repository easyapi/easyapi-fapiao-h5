import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const orderType = {
  /**
   * 获取订单类型列表
   */
  getOrderTypeList(): Promise<any> {
    return request.get('/order-types', {
      params: {
        accessToken: localStorage.get('accessToken'),
      },
    })
  },
}

export default orderType
