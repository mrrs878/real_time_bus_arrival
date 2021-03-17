/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-03-17 23:37:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { clone } from 'ramda';
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, Event, EventEmitter, workspace, ThemeIcon, window, ProgressLocation } from 'vscode';
import { getArriveBase, getBusBase, getBusStops } from '../api';

const arrowDown = new ThemeIcon('arrow-down');
const circleOutlineIcon = new ThemeIcon('circle-outline');

export class BusLineTreeItem extends TreeItem implements IBusLine {
  constructor(
    public readonly label: string,
    public readonly lineId = -1,
    public direction = true,
    public readonly collapse = TreeItemCollapsibleState.Collapsed,
    public readonly icon?: ThemeIcon,
  ) {
    super(label, collapse);
    this.direction = direction;
    this.lineId = lineId;
    this.iconPath = icon;
  }

  readonly contextValue = "BusLineItem";

  public stops: Array<any> = [];
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

  readonly command = {
    title: this.label,
    tooltip: '获取站点车辆信息',
    command: 'realTimeBus.getStopInfo',
    arguments: [this.label]
  };
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

  async getChildren(item: BusLineTreeItem|BusStopTreeItem) {
    if (item) {
      const treeItem = item as BusLineTreeItem;
      if (treeItem.stops.length !== 0) {
        const stops = (treeItem.direction ? treeItem.stops : treeItem.stops.reverse());
        const tmp = stops.slice(0, stops.length - 1).map(
          ({ zdmc }) => new BusStopTreeItem(zdmc, circleOutlineIcon)
        );
        tmp.push(new BusStopTreeItem(stops[stops.length - 1].zdmc, arrowDown));
        return tmp;
      }
      try {
        const name = encodeURIComponent(treeItem.label);
        const lineid = treeItem.lineId;
        const busStops = await getBusStops({ name, lineid });
        treeItem.stops = busStops.lineResults0.stops;
        const stops = busStops[treeItem.direction ? 'lineResults0' : 'lineResults1'].stops;
        const tmp = stops.slice(0, stops.length - 1).map(
          ({ zdmc }) => new BusStopTreeItem(zdmc, circleOutlineIcon)
        );
        tmp.push(new BusStopTreeItem(stops[stops.length - 1].zdmc, arrowDown));
        return tmp;
      } catch (e) {
        window.showErrorMessage('获取线路信息失败，刷新重试');
        return [];
      }
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
    this.instance._onDidChangeTreeData.fire(treeItem);
    this.lock = false;
  }

  static revertLine(treeItem: BusLineTreeItem) {
    treeItem.direction = !treeItem.direction;
    this.refreshLine(treeItem);
  }

  static async addLine(label: string) {
    try {
      const name = encodeURIComponent(label);
      const res = await getBusBase({ name });
      this.children = [...this.children, new BusLineTreeItem(label, parseInt(res.line_id, 10))];
      this.refreshLines();
    } catch (e) {
      window.showErrorMessage('获取线路信息失败，刷新重试');
      this.children = [...this.children, new BusLineTreeItem(label)];
      this.refreshLines();
    }
  }

  static removeLine({ label }: BusLineTreeItem) {
    this.children = this.children.filter(((item) => item.label !== label));
    this.refreshLines();
  }

  static async getStopInfo(label: string) {
    try {
      const treeItem = this.children.find((item) => item.label === label);
      if (!treeItem) {return;}
      const stop = treeItem.stops.find((item) => item.zdmc === label);
      if (!stop) {return;}
      const name = encodeURIComponent(label);
      const res = await getArriveBase({ 
        name, 
        lineid: treeItem.id || '', 
        stopid: stop.id, 
        direction: 0
      });
      console.log(res);
      window.showInformationMessage(`获取${label}站点信息`);
    } catch (e) {
      window.showErrorMessage(`获取${label}站点信息失败，点击重试`);
    }
  }
}