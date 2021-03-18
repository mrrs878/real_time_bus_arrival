/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 14:11:10
 * @LastEditTime: 2021-03-18 12:41:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/ajaxResponse.d.ts
 */
interface IBusStop {
  zdmc: string;
  id: string;
}
interface IGetBusBaseRes {
  line_name: string;
  line_id: string;
  start_earlytime: string;
  start_latetime: string;
  start_stop: string;
  end_earlytime: string;
  end_latetime: string;
  end_stop: string;
}

interface IGetBusStopsRes {
  lineResults0: {
    stops: Array<{
      zdmc: string;
      id: string;
    }>,
    direction: boolean;
  };
  lineResults1: {
    stops: Array<{
      zdmc: string;
      id: string;
    }>,
    direction: boolean;
  };
}

interface IGetArriveBaseRes {
  cars: Array<{
    stopdis: string;
    distance: string;
    terminal: string;
    time: string;
  }>;
}