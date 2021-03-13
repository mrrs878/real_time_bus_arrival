/*
 * @Author: your name
 * @Date: 2021-03-13 11:42:04
 * @LastEditTime: 2021-03-13 21:43:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\activate\busLine.ts
 */

import { commands, ExtensionContext, window } from "vscode";

export function initBusLine(context: ExtensionContext) {
  const cmd = commands.registerCommand('realTimeBus.refreshLine', (params) => {
    window.showInformationMessage('params');
  });
  context.subscriptions.push(cmd);
}