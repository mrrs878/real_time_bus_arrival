import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
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

	context.subscriptions.push(vscode.commands.registerCommand('realTimeBusLine.itemClick', (label) => {
		const webView = createWebView(context, vscode.ViewColumn.Active, label);
		context.subscriptions.push(webView);
		vscode.window.showInformationMessage(label);
	}));
}

export function deactivate() {}
