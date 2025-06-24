import request from '@/utils/request'

const pending = {
  /**
   * 根据企业开票代码获取企业信息
   *
   */
  getCompanyByCode(code: string): Promise<any> {
    return request.get(`/pending/code/${code}`)
  },

  /**
   * 申请开票
   *
   */
  createPending(data: any): Promise<any> {
    return request.post(`/pending`, data)
  },
}

export default pending
