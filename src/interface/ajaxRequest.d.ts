/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 10:36:38
 * @LastEditTime: 2021-03-17 23:35:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/ajaxRequest.d.ts
 */
interface IGetBusBaseReq {
  name: string;
}

interface IGetBusStopsReq {
  name: string;
  lineid: number;
}

interface IGetArriveBaseReq {
  name: string;
  lineid: string;
  stopid: string;
  direction: number;
}