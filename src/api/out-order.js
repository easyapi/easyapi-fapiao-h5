import axios from 'axios'

/**
 * 获取未开票外部订单列表
 *
 * @see https://www.easyai.com
 */
export const getOutOrderList = (params, page) => {
  params.size = page.size;
  params.page = page.page;
  params.state = 0;
  params.sort = "orderTime,desc";
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${process.env.VUE_APP_BASE_API}/out-orders`, {
    params: params
  });
};


/**
 * 获取外部订单数量
 *
 * @see https://www.easyai.com
 */
export const outOrderCount = (params) => {
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${process.env.VUE_APP_BASE_API}/out-order/count`, {
    params: params
  });
};
