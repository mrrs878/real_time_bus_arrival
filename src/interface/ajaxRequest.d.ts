/*
 * @Author: your name
 * @Date: 2021-03-15 10:36:38
 * @LastEditTime: 2021-03-15 14:11:49
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
  lineid: number;
  stopid: string;
  direction: number;
}