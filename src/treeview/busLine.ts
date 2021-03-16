/*
 * @Author: your name
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-16 18:49:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, ProviderResult, window, Event, EventEmitter, workspace } from 'vscode';

export class BusLineTreeItem extends TreeItem {
  constructor(public readonly label: string) {
    super(label, TreeItemCollapsibleState.None);
  }

  readonly contextValue = "BusLineItem";

  command = {
    title: this.label,
    command: 'realTimeBusLine.click',
    tooltip: this.label,
    arguments: [
      this,
    ]
  };
}

export class BusLineProvider implements TreeDataProvider<BusLineTreeItem>{
  static children: ProviderResult<Array<BusLineTreeItem>> = [];
  private static instance: BusLineProvider;

  private _onDidChangeTreeData: EventEmitter<BusLineTreeItem | undefined | void> = new EventEmitter<BusLineTreeItem | undefined | void>();
	readonly onDidChangeTreeData: Event<BusLineTreeItem | undefined | void> = this._onDidChangeTreeData.event;
  
  getTreeItem(element: BusLineTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): ProviderResult<Array<BusLineTreeItem>> {
    console.log('getChildren');
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    return lines.map(item => new BusLineTreeItem(item));
  }

  static getInstance(): BusLineProvider {
    return this.instance || (this.instance = new BusLineProvider());
  }

  static refreshLines() {
    this.instance._onDidChangeTreeData.fire();
  }

  static refreshLine(element: BusLineTreeItem) {
    console.log(element);
  }

  static revertLine(element: BusLineTreeItem) {
    console.log(element);
    this.refreshLines();
    this.refreshLines();
  }

  static addLine(label: string) {
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    configuration.update("lines", [...lines, label], true);
    this.refreshLines();
    this.refreshLines();
  }

  static removeLine({ label }: BusLineTreeItem) {
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    configuration.update("lines", lines.filter((item) => item !== label), true);
    this.refreshLines();
    this.refreshLines();
  }
  
  static click(element: BusLineTreeItem) {
    console.log(element);
  }
}