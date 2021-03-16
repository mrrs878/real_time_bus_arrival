/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 10:30:01
 * @LastEditTime: 2021-03-15 14:30:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/util/ajax.ts
 */
import axios from 'axios';
import { clone } from 'ramda';

const ajax = axios.create({ timeout: 12000 });
ajax.interceptors.request.use((config) => {
  const tmp = clone(config);
  tmp.headers.referer = 'https://apps.eshimin.com/';
  return tmp;
});
ajax.interceptors.response.use(
  (response) => Promise.resolve(response.data),
  (error) => Promise.resolve(error)
);

export default ajax;
