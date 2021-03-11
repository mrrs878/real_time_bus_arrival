<!--
 * @Author: your name
 * @Date: 2021-03-11 18:49:54
 * @LastEditTime: 2021-03-11 19:21:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /real-time-bus-arrival/README.md
-->
## 添加指令(cmd+shift+p)

1. `package.json`中的`contributes.command`字段注册指令`{"command": "commandId","title": "commandTitle"}`

2. `package.json`中的`activationEvents`添加`onCommand:commandId`

3. 使用`registerCommand`添加指令对应的回调

4. `context.subscriptions.push`添加指令到插件中
