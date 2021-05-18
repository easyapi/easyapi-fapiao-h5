import axios from 'axios'
/**
 * 查询设置信息
 *
 * @see https://www.easyai.com
 */
export const findSetting = (params) => {
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${process.env.VUE_APP_BASE_API}/setting/find`, {
    params: params
  });
};
