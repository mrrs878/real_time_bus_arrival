/*
 * @Author: mrrs878@foxmail.com
 * @Date: 2021-03-12 17:35:45
 * @LastEditTime: 2021-04-06 10:13:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/src/treeview/busLine.ts
 */
import { utils } from 'mocha';
import { clone } from 'ramda';
import { TreeItem, TreeItemCollapsibleState, 
  TreeDataProvider, Event, EventEmitter, workspace, ThemeIcon, window, ProgressLocation } from 'vscode';
import { getArriveBase, getBusBase, getBusStops } from '../api';

const arrowDown = new ThemeIcon('arrow-down');
const circleOutlineIcon = new ThemeIcon('circle-outline');

interface IStopLineInfo {
  label: string;
  lineid: string;
  direction: number;
}

export class BusLineTreeItem extends TreeItem implements IBusLine {
  constructor(
    public readonly label: string,
    public readonly lineid = '',
    public direction = true,
    public readonly collapse = TreeItemCollapsibleState.Collapsed,
    public readonly timeInfo: Omit<IBusBase, 'line_id'|'line_name'>|undefined = undefined,
    public readonly icon?: ThemeIcon,
  ) {
    super(label, collapse);
    this.direction = direction;
    this.lineid = lineid;
    this.iconPath = icon;
  }

  readonly contextValue = "BusLineItem";

  public stops0: Array<any> = [];
  public stops1: Array<any> = [];
}

export class BusStopTreeItem extends TreeItem {
  constructor(
    public readonly label: string,
    public readonly icon: ThemeIcon,
    public readonly stopid: string,
    public readonly lineInfo: IStopLineInfo,
  ) {
    super(label, TreeItemCollapsibleState.None);
    this.iconPath = icon;
    this.stopid = stopid;
    this.lineInfo = lineInfo;
  }

  readonly contextValue = "BusStopTreeItem";

  readonly command = {
    title: this.label,
    tooltip: '获取站点车辆信息',
    command: 'realTimeBus.getStopInfo',
    arguments: [{ label: this.label, stopid: this.stopid, lineInfo: this.lineInfo }]
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
      try {
        const treeItem = item as BusLineTreeItem;
        let stops: Array<any> = [];
        const { label, lineid, direction, timeInfo } = treeItem;
        if (treeItem.stops0.length === 0) {
          const name = encodeURIComponent(treeItem.label);
          const lineid = treeItem.lineid;
          console.log({ name, lineid });
          
          const { data } = await getBusStops({ name, lineid });
          stops = data[direction ? 'lineResults0' : 'lineResults1'].stops;
          treeItem.stops0 = data.lineResults0.stops;
          treeItem.stops1 = data.lineResults1.stops;
        } else {
          stops = (direction ? treeItem.stops0 : treeItem.stops1);
        }
        const tmp = stops.slice(1, stops.length - 1).map(
          ({ zdmc, id }) => new BusStopTreeItem(zdmc, circleOutlineIcon, id, { label, lineid, direction: direction ? 0 : 1 })
        );
        const endStop = clone(stops[stops.length - 1]);
        const startStop = clone(stops[0]);
        const { start_earlytime, start_latetime, end_earlytime, end_latetime } = timeInfo || {};
        const time = direction ? `${start_earlytime}--${start_latetime}` : `${end_earlytime}--${end_latetime}`;
        tmp.unshift(new BusStopTreeItem(`${startStop.zdmc}: ${time}`, circleOutlineIcon, startStop.id, { label, lineid, direction: direction ? 0 : 1 }));
        tmp.push(new BusStopTreeItem(endStop.zdmc, arrowDown, endStop.id, { label, lineid, direction: direction ? 0 : 1 }));
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
    this.syncChildren2ConfigFile();
  }

  static async addLine(label: string, direction = true) {
    try {
      const name = encodeURIComponent(label);
      const { data, success, msg } = await getBusBase({ name });
      if (!success) {
        window.showInformationMessage(msg);
        return;
      }
      this.children = [...this.children, new BusLineTreeItem(label, 
        data.line_id, 
        direction, 
        TreeItemCollapsibleState.Collapsed, 
        data,
      )];
      this.refreshLines();
    } catch (e) {
      console.log(e);
      const action = await window.showErrorMessage('获取线路信息失败，刷新重试', '刷新');
      if (action === '刷新') {BusLineProvider.addLine(label);}
    }
  }

  static removeLine({ label }: BusLineTreeItem) {
    this.children = this.children.filter(((item) => item.label !== label));
    this.refreshLines();
    this.syncChildren2ConfigFile();
  }

  static async getStopInfo({ label, stopid, lineInfo }: any) {
    try {
      const { lineid, direction } = lineInfo;
      const name = encodeURIComponent(lineInfo.label);
      const { data } = await getArriveBase({ 
        name, 
        lineid, 
        stopid, 
        direction,
      });
      if (!data?.cars || data.cars.length === 0) {
        window.showInformationMessage(`暂无${label}站点车辆信息，稍后重试`);
        return;
      }
      const { cars } = data;
      window.showInformationMessage(`距离${label}最近一辆车还有${cars[0].stopdis}站,${(parseInt(cars[0].time, 10) / 60) >> 0}分钟到达`);
    } catch (e) {
      console.log(e);
      const action = await window.showErrorMessage(`获取${label}站点信息失败，点击重试`, '重试');
      if (action === '重试'){BusLineProvider.getStopInfo({ label, stopid, lineInfo });}
    }
  }

  static syncChildren2ConfigFile() {
    const configuration = workspace.getConfiguration('realTimeBus');
    configuration.update("lines", this.children.map(({ label, direction, lineid: lineId }) => ({
      label, direction, lineId 
    })), true);
  }

  static syncConfigFile2Children() {
    const configuration = workspace.getConfiguration('realTimeBus');
    const lineLabels: Array<IBusLine> = configuration.get("lines") || [];
    lineLabels.forEach(({ label, direction }) => BusLineProvider.addLine(label, direction));
    this.refreshLines();
  }
}