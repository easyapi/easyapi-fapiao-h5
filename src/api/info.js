import axios from 'axios'

/**
 * 获取开票规则
 *
 * @see https://www.easyai.com
 */
export const getRule = () => axios.get(`${process.env.VUE_APP_BASE_API}/api/invoice/rule`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});
