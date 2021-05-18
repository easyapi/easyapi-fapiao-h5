import axios from 'axios'

/**
 * 获取我的客户信息
 *
 * @see https://www.easyai.com
 */
export const getCustomer = (params) => axios.get(`${process.env.VUE_APP_BASE_API}/customer`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken"),
    taxNumber: localStorage.getItem("taxNumber")
  }
});
