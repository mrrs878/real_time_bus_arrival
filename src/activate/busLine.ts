/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-13 11:42:04
 * @LastEditTime: 2021-03-23 19:07:54
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\activate\busLine.ts
 */

import { commands, window, workspace } from "vscode";
import { BusLineProvider } from "../treeview/busLine";

export function initBusLine() {
	window.registerTreeDataProvider('realTimeBusLine', BusLineProvider.getInstance());
  const configuration = workspace.getConfiguration('realTimeBus');
  const lineLabels: Array<IBusLine> = configuration.get("lines") || [];
  lineLabels.forEach(({ label, direction }) => BusLineProvider.addLine(label, direction));

  commands.registerCommand('realTimeBus.refreshLines', () => {
    BusLineProvider.refreshLines();
  });
  commands.registerCommand('realTimeBus.addLine', async () => {
    const value = await window.showInputBox({
      placeHolder: '请输入正确的线路名称',
    });
    BusLineProvider.addLine(value as string);
  });
  commands.registerCommand('realTimeBus.removeLine', (params) => {
    BusLineProvider.removeLine(params);
  });
  commands.registerCommand('realTimeBus.refreshLine', (params) => {
    BusLineProvider.refreshLine(params);
  });
  commands.registerCommand('realTimeBus.revertLine', (params) => {
    BusLineProvider.revertLine(params);
  });
  commands.registerCommand('realTimeBus.getStopInfo', (params) => {
    BusLineProvider.getStopInfo(params);
  });
}