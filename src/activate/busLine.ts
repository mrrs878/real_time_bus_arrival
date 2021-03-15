/*
 * @Author: your name
 * @Date: 2021-03-13 11:42:04
 * @LastEditTime: 2021-03-15 16:25:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\activate\busLine.ts
 */

import { commands, ExtensionContext, window } from "vscode";
import { BusLineProvider } from "../treeview/busLine";

export function initBusLine(context: ExtensionContext) {
  const refreshLinesCmd = commands.registerCommand('realTimeBus.refreshLines', (params) => {
    console.log(params);
    BusLineProvider.refreshLines();
  });
  const refreshLineCmd = commands.registerCommand('realTimeBus.refreshLine', (params) => {
    BusLineProvider.refreshLine();
  });
  const revertLineCmd = commands.registerCommand('realTimeBus.revertLine', (params) => {
    BusLineProvider.revertLine();
  });
  const clickLineCmd = commands.registerCommand('realTimeBusLine.click', (label) => {
		BusLineProvider.click(label);
	});
  context.subscriptions.push(clickLineCmd);
  context.subscriptions.push(refreshLinesCmd);
  context.subscriptions.push(refreshLineCmd);
  context.subscriptions.push(revertLineCmd);
}