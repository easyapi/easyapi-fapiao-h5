import axios from 'axios'

/**
 * 获取订单类型列表
 */
export const getOrderTypeList = () => axios.get(`${process.env.VUE_APP_BASE_API}/order-types`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});
