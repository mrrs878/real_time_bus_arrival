/*
 * @Author: your name
 * @Date: 2021-03-13 11:30:34
 * @LastEditTime: 2021-03-13 21:48:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \real_time_bus_arrival\src\extension.ts
 */
import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
import { initBusLine } from './activate/busLine';
import { BusLineProvider, TreeItemNode } from './treeview/busLine';
import { createWebView } from './webview/busLine';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "real-time-bus-arrival" is now active!');
	
	BusLineProvider.initTreeViewItem(['浦东25路','1117','1110'].map(
		item => new TreeItemNode(
			item as string,
			TreeItemCollapsibleState.None,
		)
	));

 	initBusLine(context);

	context.subscriptions.push(vscode.commands.registerCommand('realTimeBusLine.itemClick', (label) => {
		const webView = createWebView(context, vscode.ViewColumn.Active, label);
		context.subscriptions.push(webView);
		vscode.window.showInformationMessage(label);
	}));
}

export function deactivate() {}
