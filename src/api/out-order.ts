import request from '@/utils/request'
import { localStorage } from '@/utils/local-storage'

/**
 * 获取未开票外部订单列表
 * @see https://www.easyapi.com
 */
export async function getOutOrderListApi(params): Promise<any> {
  return request.get('/out-orders', {
    params: {
      accessToken: localStorage.get('accessToken'),
      sort: 'orderTime,desc',
      state: 0,
      ...params,
    },
  })
}

/**
 * 获取外部订单数量
 *
 * @see https://www.easyapi.com
 */
export async function getOutOrderCountApi(params): Promise<any> {
  return request.get('/out-order/count', {
    params: {
      accessToken: localStorage.get('accessToken'),
      ...params,
    },
  })
}
