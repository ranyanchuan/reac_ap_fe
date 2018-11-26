import React, {Component} from 'react';
import {Navbar, Menu, Badge, Tile, Icon, Tooltip} from 'tinper-bee';
import 'static/trd/tinper-bee/assets/tinper-bee.css'
import 'static/css/index.css';

/* 引入字体文件 */
require('static/fonts/iuap_qy/iconfont.css');
require('static/fonts/pap/iconfont.css');
require('static/fonts/moren/iconfont.css');

import {ConnectedHeader} from '../../container'
import {ConnectedSidebar} from '../../container'
import {ConnectedTabBox} from '../../container'


class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {

        };
    }

    render() {

        const {expanded,menus,current} = this.props;

        return (
            <div id="portal" className={"portal-expand " + (expanded ? "expanded" : "")}>

                {/*加载侧边栏*/}
                <ConnectedSidebar/>

                <div id="content">
                    {/*加载导航栏*/}
                    <ConnectedHeader/>
                    {/*加载Tab标签*/}
                    <ConnectedTabBox/>

                    <div className="content">
                        {

                            menus.map(function (item, index) {

                                if(!item.id) return false;
                                var match = /.*(#\/ifr\/)/ig;
                                var selected = current == item.id ? "ifr-selected" : "";

                                item.router = decodeURIComponent(decodeURIComponent(item.router.replace(match, '')));

                                return (
                                        <iframe key={item.id} ref={item.id} className={'ifr-tabs '+selected} id={item.id}
                                                src={item.router} style={{border: '0'}}></iframe>

                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default App;
