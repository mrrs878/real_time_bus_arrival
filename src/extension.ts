/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-13 11:30:34
 * @LastEditTime: 2021-03-25 23:28:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\extension.ts
 */
import * as vscode from 'vscode';
import { initBusLine } from './activate/busLine';

export function activate(context: vscode.ExtensionContext) {
 	initBusLine();
}

export function deactivate() {
	// todo
}
