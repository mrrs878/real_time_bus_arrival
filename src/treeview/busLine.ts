/*
 * @Author: your name
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-16 13:17:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, ProviderResult, window, Event, EventEmitter, workspace } from 'vscode';

export class BusLineItem extends TreeItem {
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

export class BusLineProvider implements TreeDataProvider<BusLineItem>{
  static children: ProviderResult<Array<BusLineItem>> = [];
  private static instance: BusLineProvider;
  
  getTreeItem(element: BusLineItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): ProviderResult<Array<BusLineItem>> {
    return BusLineProvider.children;
  }

  static getInstance(): BusLineProvider {
    return this.instance || (this.instance = new BusLineProvider());
  }

  static refreshLines() {
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    BusLineProvider.children = lines.map(item => new BusLineItem(item));
  }

  static refreshLine(element: BusLineItem) {
    console.log(element);
  }

  static revertLine(element: BusLineItem) {
    console.log(element);
  }

  static addLine(label: string) {
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    configuration.update("lines", [...lines, label], true);
  }

  static removeLine({ label }: BusLineItem) {
    const configuration = workspace.getConfiguration('RealTimeBus');
    const lines: Array<string> = configuration.get("lines") || [];
    configuration.update("lines", lines.filter((item) => item !== label), true);
  }
  
  static click(element: BusLineItem) {
    console.log(element);
  }

  static initTreeViewItem(children: ProviderResult<Array<BusLineItem>>){
    BusLineProvider.children = children;
    const treeViewProvider = new BusLineProvider();
    window.registerTreeDataProvider('realTimeBusLine', treeViewProvider);
  }
}