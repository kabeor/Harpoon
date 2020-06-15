import axios from "axios"

const instance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
    timeout: 5000,
    responseType: 'json'
})

/**
 * get请求
 * @param {*} url     请求地址
 * @param {*} params  url参数
 */
export function get(url, params) {
    return instance.get(url, {
      params,
    });
  }
  
  /**
   * post请求
   * @param {*} url     请求地址
   * @param {*} data    数据
   */
  export function post(url, data) {
    return instance.post(url, data);
  }

  /**
 * put请求
 * @param {*} url     请求地址
 * @param {*} data    数据
 */
export function put(url, data) {
    return instance.put(url, data);
  }
  
  /**
   * delete请求
   * @param {*} url   请求地址
   */
  export function del(url) {
    return instance.delete(url);
  }