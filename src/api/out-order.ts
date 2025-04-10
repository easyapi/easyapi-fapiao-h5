import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const outOrder = {
  /**
   * 获取未开票外部订单列表
   * @see https://www.easyapi.com
   */
  getOutOrderList(params: any): Promise<any> {
    return request.get('/out-orders', {
      params: {
        accessToken: localStorage.get('accessToken'),
        sort: 'orderTime,desc',
        state: 0,
        ...params,
      },
    })
  },

  /**
   * 获取外部订单数量
   *
   * @see https://www.easyapi.com
   */
  getOutOrderCount(params: any): Promise<any> {
    return request.get('/out-order/count', {
      params: {
        accessToken: localStorage.get('accessToken'),
        ...params,
      },
    })
  },
}

export default outOrder
