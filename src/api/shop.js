import axios from 'axios'


/**
 * 获取商户支持信息
 *
 * @see https://www.easyai.com
 */
export const getShopSupport = () => axios.get(`${process.env.VUE_APP_BASE_API}/api/shop/0/support`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 获取商户详情信息
 * @see https://www.easyai.com
 */
export const getShop = () => axios.get(`${process.env.VUE_APP_BASE_API}/api/shop`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

