import axios from 'axios'


/**
 * 获取发票自定义分类列表
 *
 * @see https://www.easyai.com
 */
export const getCustomCategoryList = (params) => {
  params.accessToken = localStorage.getItem("accessToken")
  params.taxNumber = localStorage.getItem("taxNumber")
  return axios.get(`${process.env.VUE_APP_BASE_API}/custom-categories`, {
    params: params
  });
}
