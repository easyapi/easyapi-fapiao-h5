import axios from 'axios'

/**
 * 查询客户服务器订单信息
 *
 * @see https://www.easyai.com
 */
export const queryShopOrder = (outOrderNo) => axios.get(`${process.env.VUE_APP_BASE_API}/shop-order/${outOrderNo}/query`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 批量查询发票状态
 */
export const getState = (outOrderNo) => axios.get(`${process.env.VUE_APP_BASE_API}/invoice/state`, {
  params: {
    outOrderNos: outOrderNo,
    accessToken: localStorage.getItem("accessToken")
  }
});
