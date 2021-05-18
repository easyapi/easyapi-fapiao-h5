import axios from 'axios'

/**
 * 开具发票
 *
 * @see https://www.easyai.com
 */
export const makeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${process.env.VUE_APP_BASE_API}/invoice/make`, data);
};


/**
 * 合并外部订单开具发票
 *
 * @see https://www.easyai.com
 */
export const mergeMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${process.env.VUE_APP_BASE_API}/merge-make`, data);
};


/**
 * 大类开具发票
 *
 * @see https://www.easyai.com
 */
export const categoryMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  data.taxNumber = localStorage.getItem("taxNumber")
  return axios.post(`${process.env.VUE_APP_BASE_API}/invoice/category/make`, data);
};


/**
 * 商品明细开具发票
 *
 * @see https://www.easyai.com
 */
export const productMakeInvoice = (data) => {
  data.accessToken = localStorage.getItem("accessToken")
  return axios.post(`${process.env.VUE_APP_BASE_API}/invoice/product/make`, data);
};
