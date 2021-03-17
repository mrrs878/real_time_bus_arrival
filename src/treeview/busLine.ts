/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-17 15:39:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { clone } from 'ramda';
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, Event, EventEmitter, workspace, ThemeIcon, window, ProgressLocation } from 'vscode';
import { getBusBase, getBusStops } from '../api';

const chevronDownIcon = new ThemeIcon('chevron-down');
const chevronRightIcon = new ThemeIcon('chevron-right');
const circleOutlineIcon = new ThemeIcon('circle-outline');
const circleFilledIcon = new ThemeIcon('circle-filled');

export class BusLineTreeItem extends TreeItem implements IBusLine {
  constructor(
    public readonly label: string,
    public readonly lineId = -1,
    public readonly direction = true,
    public readonly collapse = TreeItemCollapsibleState.Collapsed,
    public readonly icon?: ThemeIcon,
  ) {
    super(label, collapse);
    this.direction = direction;
    this.lineId = lineId;
    this.iconPath = icon;
  }

  readonly contextValue = "BusLineItem";
}

export class BusStopTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly icon: ThemeIcon,
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.iconPath = icon;
  }

  readonly contextValue = "BusStopTreeItem";
}

export class BusLineProvider implements TreeDataProvider<BusLineTreeItem|BusStopTreeItem>{
  private static children: Array<BusLineTreeItem> = [];
  private static instance: BusLineProvider;
  private static lock = false;

  private _onDidChangeTreeData: EventEmitter<BusLineTreeItem | undefined | void> 
    = new EventEmitter<BusLineTreeItem | undefined | void>();
	readonly onDidChangeTreeData: Event<BusLineTreeItem | undefined | void>
    = this._onDidChangeTreeData.event;
  
  getTreeItem(element: BusLineTreeItem) {
    return element;
  }

  async getChildren(treeItem: BusLineTreeItem|BusStopTreeItem) {
    if (treeItem) {
      console.log(111);
      const name = encodeURIComponent(treeItem.label);
      const { line_id } = await getBusBase({ name });
      const busStops = await getBusStops({ name, lineid: line_id });
      return busStops.lineResults0.stops.map(({ zdmc }) => new BusStopTreeItem(zdmc, circleOutlineIcon));
    }
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
    if (this.lock) {return;}
    this.lock = true;
    window.withProgress({
      location: ProgressLocation.Notification,
      title: `刷新${treeItem.label}线路信息中...`,
      cancellable: true
    }, async (progress, token) => {
      try {
        token.onCancellationRequested(() => {
          window.showInformationMessage(`取消刷新${treeItem.label}线路信息`);
        });
        this.instance._onDidChangeTreeData.fire(treeItem);
        this.lock = false;
        return Promise.resolve();
      } catch (e) {
        window.showErrorMessage(e.toString());
        this.lock = false;
        return Promise.resolve();
      }
    });
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
}