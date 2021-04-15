import axios from 'axios'

import {baseUrl} from "../utils/request";

/**
 * 查询设置信息
 *
 * @see https://www.easyai.com
 */
export const findSetting = (params) => {
  params.accessToken = localStorage.getItem("accessToken");
  return axios.get(`${baseUrl}/setting/find`, {
    params: params
  });
};
