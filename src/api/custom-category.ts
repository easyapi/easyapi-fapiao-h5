import { localStorage } from '@/utils/local-storage'
import request from '@/utils/request'

const customCategory = {
  /**
   * 获取发票自定义分类列表
   *
   * @see https://www.easyapi.com
   */
  getCustomCategoryList(params: any): Promise<any> {
    return request.get('/custom-categories', {
      params: {
        accessToken: localStorage.get('accessToken'),
        taxNumber: localStorage.get('taxNumber'),
        ...params,
      },
    })
  },
}

export default customCategory
