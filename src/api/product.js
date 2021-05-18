import axios from 'axios'

/**
 * 获取商品列表
 *
 * @see https://www.easyai.com
 */
export const getProductList = (searchParams) => {
  let params = {...searchParams};
  params.size = 100
  params.accessToken = localStorage.getItem("accessToken")
  return axios.get(`${process.env.VUE_APP_BASE_API}/products`, {
    params: params
  });
}
