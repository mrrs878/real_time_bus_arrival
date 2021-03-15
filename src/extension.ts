/*
 * @Author: your name
 * @Date: 2021-03-13 11:30:34
 * @LastEditTime: 2021-03-15 22:43:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\extension.ts
 */
import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
import { initBusLine } from './activate/busLine';
import { getBusBase } from './api';
import { BusLineProvider, BusLineItem } from './treeview/busLine';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "real-time-bus-arrival" is now active!');
	
	const configuration = vscode.workspace.getConfiguration('RealTimeBus');
	const lines: Array<string> = configuration.get("lines") || [];
	BusLineProvider.initTreeViewItem(lines.map(item => new BusLineItem(item)));
	// Promise.all(lines.map((name) => getBusBase({ name: encodeURIComponent(name) }))).then((res) => {
	// 	console.log(res);
	// });

 	initBusLine(context);
}

export function deactivate() {}
