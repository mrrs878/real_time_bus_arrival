/*
 * @Author: your name
 * @Date: 2021-03-15 10:27:03
 * @LastEditTime: 2021-03-15 14:21:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/api/index.ts
 */
import ajax from '../util/ajax';
import { obj2QueryString } from '../tool';

// 获取线路基本信息（首末站点、发车时间、lineid）
export const getBusBase = (data: IGetBusBaseReq): Promise<IGetBusBaseRes> => 
  ajax.get(`https://apps.eshimin.com/traffic/gjc/getBusBase?${obj2QueryString(data)}`);
// 获取线路站点信息
export const getBusStops = (data: IGetBusStopsReq): Promise<IGetBusStopsRes> => 
  ajax.get(`https://apps.eshimin.com/traffic/gjc/getBusStop?${obj2QueryString(data)}`);
// 获取某一站点车辆信息
export const getArriveBase = (data: IGetArriveBaseReq): Promise<IGetArriveBaseRes> => 
  ajax.get(`https://apps.eshimin.com/traffic/gjc/getArriveBase?${obj2QueryString(data)}`);