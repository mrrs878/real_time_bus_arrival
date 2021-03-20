/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 14:11:10
 * @LastEditTime: 2021-03-20 12:56:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/ajaxResponse.d.ts
 */
interface IBaseRes<T> {
  success: boolean;
  code: number;
  msg: string;
  data: T
}
interface IBusStop {
  zdmc: string;
  id: string;
}
interface IGetBusBaseRes extends IBaseRes<IBusBase> {}

interface IGetBusStopsRes extends IBaseRes<IBusStops> {}

interface IGetArriveBaseRes extends IBaseRes<{
  cars: Array<{
    stopdis: string;
    distance: string;
    terminal: string;
    time: string;
  }>;
}> {}