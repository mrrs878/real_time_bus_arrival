/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 10:41:50
 * @LastEditTime: 2021-03-18 13:04:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/index.d.ts
 */
interface IBusLine {
  label: string;
  lineid: string;
  direction: boolean;
  stops?: Array<any>;
}