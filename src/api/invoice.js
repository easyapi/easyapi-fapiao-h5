import axios from 'axios'


/**
 * 获取发票列表
 *
 * @see https://www.easyai.com
 */
export const getInvoiceList = (params) => axios.get(`${process.env.VUE_APP_BASE_API}/api/invoice/records`, {
  params: params
});

/**
 * 获取发票详情信息
 *
 * @see https://www.easyai.com
 */
export const getInvoice = (id) => {
  let params = {};
  params.accessToken = localStorage.getItem("accessToken")
  return axios.get(`${process.env.VUE_APP_BASE_API}/api/invoice/record/${id}`, {
    params: params
  });
}


/**
 * 查询发票信息
 *
 * @see https://www.easyai.com
 */
export const queryInvoice = (outOrderNo) => {
  let params = {};
  params.accessToken = localStorage.getItem("accessToken")
  return axios.get(`${process.env.VUE_APP_BASE_API}/invoice/${outOrderNo}/query`, {
    params: params
  });
}

/**
 * 获取外部订单列表
 * @param invoiceId 发票ID
 */
export const getOutOrderList = (params) => axios.get(`${process.env.VUE_APP_BASE_API}/out-orders`, {
  params: {
    ...params
  }
});

