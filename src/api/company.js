import axios from 'axios'

/**
 * 获取公司抬头列表
 *
 * @see https://www.easyai.com
 */
export const getCompanyList = (params) => axios.get(`${process.env.VUE_APP_BASE_API}/companies`, {
  params: {
    ...params,
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 获取公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const getCompany = (id) => axios.get(`${process.env.VUE_APP_BASE_API}/company/${id}`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});

/**
 * 添加公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const createCompany = (data) => {
  data.accessToken = localStorage.getItem("accessToken");
  data.ifDefault = true;
  return axios.post(`${process.env.VUE_APP_BASE_API}/company`, data);
};

/**
 * 修改公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const updateCompany = (id, data) => {
  data.accessToken = localStorage.getItem("accessToken");
  data.ifDefault = true;
  return axios.put(`${process.env.VUE_APP_BASE_API}/company/${id}`, data);
};

/**
 * 删除公司抬头信息
 *
 * @see https://www.easyai.com
 */
export const deleteCompany = id => axios.delete(`${process.env.VUE_APP_BASE_API}/company/${id}`, {
  data: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 设置为默认抬头
 *
 * @see https://www.easyai.com
 */
export const defaultCompany = id => axios.put(`${process.env.VUE_APP_BASE_API}/company/${id}`, {
  accessToken: localStorage.getItem("accessToken"),
  ifDefault: true
});

/**
 * 获取默认抬头信息
 *
 * @see https://www.easyai.com
 */
export const getDefaultCompany = () => axios.get(`${process.env.VUE_APP_BASE_API}/company/default`, {
  params: {
    accessToken: localStorage.getItem("accessToken")
  }
});


/**
 * 抬头信息查询（企业开票信息查询服务）
 *
 * @see https://www.easyai.com
 */
export const getCompanyCodeList = (params) => axios.get(`${process.env.VUE_APP_BASE_API}/company/codes`, {
  params,
  accessToken: localStorage.getItem("accessToken")
});
