/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-15 10:41:50
 * @LastEditTime: 2021-03-22 10:08:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/interface/index.d.ts
 */
interface IBusLine {
  label: string;
  lineid: string;
  direction: boolean;
  stops0?: Array<any>;
  stops1?: Array<any>;
}

interface IBusBase {
  line_name: string;
  line_id: string;
  start_earlytime: string;
  start_latetime: string;
  start_stop: string;
  end_earlytime: string;
  end_latetime: string;
  end_stop: string;
}

interface IBusStops {
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

interface IArrivalCar {
  stopdis: string;
  distance: string;
  terminal: string;
  time: string;
}