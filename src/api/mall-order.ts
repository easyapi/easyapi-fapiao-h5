import request from '@/utils/request'

const mallOrder = {
  /**
   * 用户根据订单号和金额主动申请开票
   */
  apply(data: any): Promise<any> {
    return request.post('/mall-order/apply', data)
  },

  /**
   * 获取快手订单详情
   */
  getOrderDetail(params: any): Promise<any> {
    return request.get('/ks/order-detail', {
      params: {
        ...params,
      },
    })
  },

  /**
   * 提交电商订单开票信息
   */
  createMallOrder(data: any): Promise<any> {
    return request.post('/mall-order', data)
  },

  /**
   * 查找单条电商平台信息
   */
  findMall(params: any): Promise<any> {
    return request.get('/shop/mall/find', {
      params: {
        ...params,
      },
    })
  },
}

export default mallOrder
