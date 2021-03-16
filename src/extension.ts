/*
 * @Author: your name
 * @Date: 2021-03-13 11:30:34
 * @LastEditTime: 2021-03-16 18:30:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\extension.ts
 */
import * as vscode from 'vscode';
import { TreeItemCollapsibleState, window } from 'vscode';
import { initBusLine } from './activate/busLine';
import { getBusBase } from './api';
import { BusLineProvider, BusLineTreeItem } from './treeview/busLine';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "real-time-bus-arrival" is now active!');
	
	// Promise.all(lines.map((name) => getBusBase({ name: encodeURIComponent(name) }))).then((res) => {
	// 	console.log(res);
	// });

 	initBusLine(context);
}

export function deactivate() {}
