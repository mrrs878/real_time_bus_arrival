/*
 * @Author: your name
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-12 18:38:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { TreeItem, TreeItemCollapsibleState, TreeDataProvider, ProviderResult, window } from 'vscode';

export class TreeItemNode extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState = TreeItemCollapsibleState.Collapsed,
  ){
    super(label, collapsibleState);
  }

  command = {
    title: this.label,
    command: 'realTimeBusLine.itemClick',
    tooltip: this.label,
    arguments: [
      this.label,
    ]
  };
}

export class BusLineProvider implements TreeDataProvider<TreeItemNode>{
  static children: ProviderResult<Array<TreeItemNode>> = [];

  onDidChangeTreeData?: import("vscode").Event<TreeItemNode | null | undefined> | undefined; 

  getTreeItem(element: TreeItemNode): TreeItem | Thenable<TreeItem> {
    return element;
  }

  getChildren(element?: TreeItemNode | undefined): ProviderResult<Array<TreeItemNode>> {
    return BusLineProvider.children;
  }

  public static initTreeViewItem(children: ProviderResult<Array<TreeItemNode>>){
    BusLineProvider.children = children;
    const treeViewProvider = new BusLineProvider();
    window.registerTreeDataProvider('realTimeBusLine', treeViewProvider);
  }
}