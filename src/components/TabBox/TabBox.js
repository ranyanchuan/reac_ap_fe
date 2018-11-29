/**
 * Created by yuzhao on 2017/5/31.
 */

import React,{Component} from 'react';
import ReactDom from 'react-dom';
import {Button,Con,Col,Tile,Icon,Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
require('./Tabs.css');

class Tab extends Component {
    constructor(props) {
        super(props);

        var self = this;

        var value = typeof sessionStorage['tabNotice']=='undefined'?true:sessionStorage['tabNotice'];

        this.state = {
            tabNotice:JSON.parse(value),
        };

        this.setCurrent = this.setCurrent.bind(this);

        this.del = this.del.bind(this);
    }
    setCurrent (id) {


        actions.app.updateState({
            current: id,
            showNotice:0,
            reload:0
        })


        sessionStorage['current'] = JSON.stringify({
            current:id
        });
    }

    del (id) {

        const {menus,current} = this.props;


        var menuCloned = JSON.parse(JSON.stringify(menus));

        var num = 0;
        for(var i=0;i<menuCloned.length;i++){
            if(id==menuCloned[i].id){
                menuCloned.splice(i,1);
                num = i-1;
            }
        }


        var data = {
            menus:menuCloned
        }


        //删除选中的tab时
        if(current==id){
            data.current=menuCloned[num].id;
            data.router=menuCloned[num].router;
        }

        var match = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;


        var ifr = document.getElementById(id);
        //TODO 跨域try catch
        if(ifr.src.match(match)!=null){
            if(ifr.src.match(location.host)!=null){
                try {
                    if(ifr.contentWindow.confirmClose&&typeof ifr.contentWindow.confirmClose=='function'){
                        ifr.contentWindow.confirmClose(id,data);
                        return false;
                    }
                }
                catch(err) {

                }
            }
        }
        else {
            try{
                var frameWin = ifr.contentWindow;
                ifr.src = 'about:blank';
                frameWin.document.write('');
                frameWin.document.clear();
            }catch(e){};
        }

        data.tabNum = menuCloned.length;

        sessionStorage['tabs'] = JSON.stringify(data.menus);
        sessionStorage['current'] = JSON.stringify({
            current:data.current
        });

        actions.app.updateState(data)

        return menuCloned;
    }

    notice() {
        const {tabNotice} = this.props;
        var value = tabNotice

        sessionStorage['tabNotice'] = !value;

        actions.app.updateState({
            tabNotice:!value
        })
    }
    componentDidUpdate(){
        this.tabNotice();
    }
    tabNotice (){
        const {menus} = this.props;
        if(menus.length>=11) {
            var dom = ReactDOM.findDOMNode(this.refs['tabNotice']);
            if(dom){
                dom.style.display = '';
            }
            setTimeout(function () {
                if(dom){
                    dom.style.display = 'none';
                }
            },2000)
        }
    }

    render() {

        var self = this;
        const {current,menus,tabNum,showNotice,tabNotice} = this.props;


        return (

            <div id="portalTabs" className={"tabs ui-tabs-num-"+tabNum}>
                <div className="tabs-list-box">
                    {/*<span className="tabs-list-home">*/}
                    {/*<i className="qy-iconfont icon-tubiao-shouye"></i>*/}
                    {/*</span>*/}
                    <ul className="tabs-list">
                        {
                            menus.map(function (item,index) {

                                var delIcon = index==0?'':(<i onClick={self.del.bind(this,item.id)} className="qy-iconfont icon-tubiao-guanbi x-close" key={item.router}></i>)

                                var homeIcon = index==0?<i className="qy-iconfont icon-tubiao-shouye"></i>:item.title;

                                var selected = current==item.id?'selected':'';

                                return (
                                    <li key={item.id} className={selected}>
                                        <a onClick={self.setCurrent.bind(this,item.id)} href="javascript:;" title={item.title}>
                                            {homeIcon}
                                        </a>
                                        {delIcon}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    (menus.length>=11&&tabNotice&&showNotice)?(
                        (<div ref="tabNotice" className="portalTabs-message" >
                            <p>
                                <i className="uf qy-iconfont icon-tubiao-jingshi"></i> 抱歉，页面最多展示10个窗口！
                            </p>
                            <span style={{display:'none'}} onClick={this.notice.bind(this)}>不再显示</span>
                        </div>)
                    ):null
                }
            </div>

        )
    }
}

export default Tab;