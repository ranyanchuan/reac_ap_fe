/**   * 入口、导入组件样式、渲染   */
import React from 'react';
import mirror, {
    render,
    Router
} from 'mirrorx';
import Routers from "./routes";
import 'ucf-common/src/app.less';
mirror.defaults({
    historyMode: "hash"
});
render(React.createElement(Router, {
    children: React.createElement(Routers, {
        match: {
            url: "/"
        }
    })
}), document.querySelector("#app"));