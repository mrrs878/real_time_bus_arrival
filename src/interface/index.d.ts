/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 10:41:50
 * @LastEditTime: 2021-03-17 23:31:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/index.d.ts
 */
interface IBusLine {
  label: string;
  lineId: number;
  direction: boolean;
  stops?: Array<any>;
}