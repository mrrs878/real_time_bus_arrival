/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-13 11:30:34
 * @LastEditTime: 2021-03-17 14:20:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\extension.ts
 */
import * as vscode from 'vscode';
import { initBusLine } from './activate/busLine';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "real-time-bus-arrival" is now active!');
	
	// Promise.all(lines.map((name) => getBusBase({ name: encodeURIComponent(name) }))).then((res) => {
	// 	console.log(res);
	// });

 	initBusLine();
}

export function deactivate() {}
