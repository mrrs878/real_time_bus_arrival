/*
 * @Author: your name
 * @Date: 2021-03-13 11:42:04
 * @LastEditTime: 2021-03-15 23:34:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\activate\busLine.ts
 */

import { commands, ExtensionContext } from "vscode";
import { BusLineProvider } from "../treeview/busLine";

export function initBusLine(context: ExtensionContext) {
  const refreshLinesCmd = commands.registerCommand('realTimeBus.refreshLines', () => {
    BusLineProvider.refreshLines();
  });
  const addLineCmd = commands.registerCommand('realTimeBus.addLine', () => {
    BusLineProvider.add();
  });
  const refreshLineCmd = commands.registerCommand('realTimeBus.refreshLine', (params) => {
    BusLineProvider.refreshLine(params);
  });
  const revertLineCmd = commands.registerCommand('realTimeBus.revertLine', (params) => {
    BusLineProvider.revertLine(params);
  });
  const clickLineCmd = commands.registerCommand('realTimeBusLine.click', (params) => {
		BusLineProvider.click(params);
	});
  context.subscriptions.push(clickLineCmd);
  context.subscriptions.push(addLineCmd);
  context.subscriptions.push(refreshLinesCmd);
  context.subscriptions.push(refreshLineCmd);
  context.subscriptions.push(revertLineCmd);
}