/*
 * @Author: your name
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-16 19:31:34
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
  private static children: Array<BusLineTreeItem> = [];
  private static instance: BusLineProvider;
  private static lock = false;

  private _onDidChangeTreeData: EventEmitter<BusLineTreeItem | undefined | void> 
    = new EventEmitter<BusLineTreeItem | undefined | void>();
	readonly onDidChangeTreeData: Event<BusLineTreeItem | undefined | void>
    = this._onDidChangeTreeData.event;
  
  getTreeItem(element: BusLineTreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): Array<BusLineTreeItem> {
    return BusLineProvider.children;
  }

  static getInstance(): BusLineProvider {
    return this.instance || (this.instance = new BusLineProvider());
  }

  static refreshLines(action: () => void = () => {}) {
    if (!this.lock) {
      this.lock = true;
      action();
      this.instance._onDidChangeTreeData.fire();
      const configuration = workspace.getConfiguration('RealTimeBus');
      configuration.update("lines", this.children.map(({ label }) => label), true);
      this.lock = false;
    }
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
    this.children = [...this.children, new BusLineTreeItem(label)];
    BusLineProvider.refreshLines();
  }

  static removeLine({ label }: BusLineTreeItem) {
    this.children = this.children.filter(((item) => item.label !== label));
    BusLineProvider.refreshLines();
  }
  
  static click(element: BusLineTreeItem) {
    console.log(element);
  }
}