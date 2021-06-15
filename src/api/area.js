import axios from 'axios'

/**
 * 获取省市区
 *
 * @see https://www.easyai.com
 */
export const getAreaList = () => {
  axios({
    url: "https://qiniu.easyapi.com/area.json",
    dataType: "json",
    async: true,
    type: "GET"
  })
};
