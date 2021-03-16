/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-16 23:12:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { clone } from 'ramda';
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, Event, EventEmitter, workspace, ThemeIcon } from 'vscode';

const chevronDownIcon = new ThemeIcon('chevron-down');
const chevronRightIcon = new ThemeIcon('chevron-right');

export class BusLineTreeItem extends TreeItem implements IBusLine {
  constructor(
    public readonly label: string,
    public readonly lineId = -1,
    public readonly direction = true,
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.direction = direction;
    this.lineId = lineId;
  }

  readonly contextValue = "BusLineItem";

  public iconPath = chevronRightIcon;

  readonly command = {
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
      configuration.update("lines", this.children.map(({ label, direction, lineId }) => ({
        label, direction, lineId 
      })), true);
      this.lock = false;
    }
  }

  static refreshLine(treeItem: BusLineTreeItem) {
    console.log(treeItem);
  }

  static revertLine({ label, direction }: BusLineTreeItem) {
    const index = this.children.findIndex((item) => item.label === label);
    if (index === -1) {return;}
    const tmp = clone(this.children);
    tmp[index] = { ...tmp[index], direction: !direction };
    this.children = tmp;
    this.refreshLines();
  }

  static addLine(label: string) {
    this.children = [...this.children, new BusLineTreeItem(label)];
    this.refreshLines();
  }

  static removeLine({ label }: BusLineTreeItem) {
    this.children = this.children.filter(((item) => item.label !== label));
    this.refreshLines();
  }

  static toggleLine(label: string, iconPath: ThemeIcon) {
    const tmp = clone(this.children);
    tmp.forEach((item) => item.iconPath = chevronRightIcon);
    const index = tmp.findIndex((item) => item.label === label);
    tmp[index].iconPath = iconPath.id === 'chevron-down' 
      ? chevronRightIcon 
      : chevronDownIcon;
    this.children = tmp;
  }
  
  static click(treeItem: BusLineTreeItem) {
    treeItem.iconPath = treeItem.iconPath.id === 'chevron-down' 
      ? chevronRightIcon 
      : chevronDownIcon;
    this.refreshLines();
  }
}