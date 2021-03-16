/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-13 11:42:04
 * @LastEditTime: 2021-03-16 22:27:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\activate\busLine.ts
 */

import { commands, ExtensionContext, window, workspace } from "vscode";
import { BusLineProvider, BusLineTreeItem } from "../treeview/busLine";

export function initBusLine(context: ExtensionContext) {
	window.registerTreeDataProvider('realTimeBusLine', BusLineProvider.getInstance());
  const configuration = workspace.getConfiguration('RealTimeBus');
  const lineLabels: Array<IBusLine> = configuration.get("lines") || [];
  lineLabels.forEach(({ label }) => BusLineProvider.addLine(label));

  const refreshLinesCmd = commands.registerCommand('realTimeBus.refreshLines', () => {
    BusLineProvider.refreshLines();
  });
  const addLineCmd = commands.registerCommand('realTimeBus.addLine', async () => {
    const value = await window.showInputBox({
      placeHolder: '请输入正确的线路名称',
    });
    BusLineProvider.addLine(value as string);
  });
  const removeLineCmd = commands.registerCommand('realTimeBus.removeLine', (params) => {
    BusLineProvider.removeLine(params);
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