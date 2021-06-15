import axios from 'axios'

/**
 * 获取七牛KEY
 */
export const getQiniuKey = () => axios.get(`https://api2.easyapi.com/qiniu/key`);


/**
 * 获取七牛空间TOKEN
 */
export const getQiniuToken = () => axios.get(`https://api2.easyapi.com/qiniu/upToken`);

/**
 * 七牛上传
 */
export const qiniuUpload = (data) => {
  axios({
    method: "POST",
    url: "https://upload.qiniup.com/",
    data: data,
    timeout: 30000
  })
};
