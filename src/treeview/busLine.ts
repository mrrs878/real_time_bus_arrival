/*
 * @Author: your name
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-15 19:10:18
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { TreeItem, TreeItemCollapsibleState, TreeDataProvider, ProviderResult, window, Event } from 'vscode';

export class TreeItemNode extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState = TreeItemCollapsibleState.Collapsed,
  ){
    super(label, collapsibleState);
  }

  readonly contextValue = "TreeItemNode";

  command = {
    title: this.label,
    command: 'realTimeBusLine.click',
    tooltip: this.label,
    arguments: [
      this.label,
    ]
  };
}

export class BusLineProvider implements TreeDataProvider<TreeItemNode>{
  static children: ProviderResult<Array<TreeItemNode>> = [];
  static activeChildrenLabel: string;

  getTreeItem(element: TreeItemNode): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(): ProviderResult<Array<TreeItemNode>> {
    console.log(111);
    return BusLineProvider.children;
  }

  static refreshLines() {
    console.log(BusLineProvider.activeChildrenLabel);
  }

  static refreshLine() {
    console.log(BusLineProvider.activeChildrenLabel);
  }

  static revertLine() {}

  static add() {}
  
  static click(label: string) {
    BusLineProvider.activeChildrenLabel = label;
    console.log(label);
  }

  static initTreeViewItem(children: ProviderResult<Array<TreeItemNode>>){
    BusLineProvider.children = children;
    const treeViewProvider = new BusLineProvider();
    window.registerTreeDataProvider('realTimeBusLine', treeViewProvider);
  }
}