/*
 * @Author: your name
 * @Date: 2021-03-15 10:33:42
 * @LastEditTime: 2021-03-15 14:47:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/tool/index.ts
 */
export function obj2QueryString(params: any) {
  const str = (Reflect.ownKeys(params) as Array<string>).reduce((pre, cur) => `${pre}&${cur}=${params[cur]}`, '');
  return str.slice(1).replace(/\+/g, '%2b');
}