import React,{Component} from "react";
import cookie from "react-cookie";
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import UserMenus from 'components/UserMenu/UserMenu';

const Header = Navbar.Header;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const NavItem = Navbar.NavItem;
const Brand = Navbar.Brand;
const Collapse = Navbar.Collapse;
const Toggle = Navbar.Toggle;
const Nav = Navbar.Nav;

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            expanded:false,
            openKeys:[],
            curentOpenKeys: [],
        };
        this.handleClick = this.handleClick.bind(this);
    }
    onToggle(value) {
        //this.setState({expanded: value});
        let {expanded,openKeys,curentOpenKeys} = this.props;

        var v = expanded;

        if (v) {
            var keys = openKeys;
            actions.app.updateState({ expanded: !v, openKeys: [], curentOpenKeys: keys });
        } else {
            var _keys = curentOpenKeys;
            actions.app.updateState({ expanded: !v, openKeys: _keys, curentOpenKeys: _keys });
        }
    }
    showMenu(e) {
        let {userMenu} = this.props;
        actions.app.updateState()
    }
    handleClick(e,reload) {
        //判断是否点击子菜单,1:当前子菜单，2:2级别子菜单。。。
        let {menus,current} = this.props;

        var self = this;

        // var data  = (e.keyPath.length==1)?{
        //     current: e.key,
        //     openKeys: [],
        //     submenuSelected:'',
        //     curentOpenKeys:[],
        //     userMenu:false
        // }:{
        //     current: e.key
        // };


        var tar = e.target||e.domEvent.target;

        var target = $(tar).closest('a');



        if(!target.is('a')){
            return false;
        }
        var value = target.attr('value');


        var data = {
            current: value,
            showNotice:0,
            reload:0
        };

        if(typeof value == 'undefined'){
            return false;
        }

        if(value=='logout'){
            return false;
        }


        var dom = target;
        var title = dom.attr('name');
        var router =  dom.attr('href');



        var options = {
            title:title,
            router:router,
            id:value
        };


        var menu = menus;




        //点击已经选中的节点时
        if(value==current){
            var url = location.hash;
            //window.router.dispatch('on', url.replace('#',''));
        }
        else {
            if(typeof dom!="undefined"&&dom.attr('target')=='_blank'){
                return false;
            }
            else {
                var menuObj = JSON.parse(JSON.stringify(menu));


                if(menuObj.length==11&&JSON.stringify(menu).indexOf('"id":"'+options.id+'"')==-1&&menu.length!=0) {
                    actions.app.updateState({
                        showNotice:1
                    });
                    return false;
                }
                else if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')!=-1){
                    data = {
                        current: value,
                        showNotice:0,
                        reload:reload?1:0,
                        currentRouter:reload?decodeURIComponent(decodeURIComponent(router.replace('#\/ifr\/',''))):''
                    };
                }
                actions.app.updateState(data);
            }
        }
        this.createTab(options);
    }
    createTab (options,value) {


        var self = this;
        var {menus} = this.props;

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }


        var menu = menus;


        if(JSON.stringify(menu).indexOf('"id":"'+options.id+'"')!=-1&&menu.length!=0){
            return false;
        }


        var menuObj = JSON.parse(JSON.stringify(menu));



        if(menuObj.length==11) {
            return false;
        }

        menuObj[menuObj.length] = options;


        sessionStorage['tabs'] = JSON.stringify(menuObj);

        sessionStorage['current'] = JSON.stringify({
            current:options.id
        });

        actions.app.updateState({
            menus:menuObj,
            current:options.id
        });


    }
    formmaterUrl(item) {
        var uri = " ";
        if (item.urltype === 'url') {
            var target=item.openview=="newpage"?"_blank":"";
            if(target){
                // uri = '#/ifrNoHead/' + encodeURIComponent(encodeURIComponent(item.location));
                uri = item.location;
            }else{
                uri = '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
            }
            return  uri;
        } else if (item.urltype === 'plugin') {
            uri = item.id ? ('#/' + item.id) : "#/index_plugin";

            uri = `${GROBAL_HTTP_CTX}/`+encodeURIComponent(encodeURIComponent('index-view.html'+uri));
            return  uri;
        } else if (item.urltype === 'view') {
            uri = item.location;
            uri= uri.replace("#", "/");

            if(uri[0]=='/'){
                uri = "/sidebar"+uri;
            }else{
                uri = "/sidebar/"+uri;
            }
            // window.addRouter(uri);
            // return  "#"+uri;

            return `${GROBAL_HTTP_CTX}/`+'index-view.html#'+uri;
        }else if(item.urltype == undefined){
            item.location = '404';
            return  '#/ifr/' + encodeURIComponent(encodeURIComponent(item.location));
        }
        else {
            return item.location;
        }
    }

    handleDefault(e,isDefault) {
        isDefault = (isDefault=="_blank")?false:true;
        if(window.isOpenTab&&isDefault){
            //dom.href = 'javascript:;'
            e.preventDefault();
        }
    }
    render (){
        let self = this;

        const {expanded,menus} = this.props;

        var UserMenuObj = {
            formmaterUrl:self.formmaterUrl,
            handleClick:self.handleClick,
            handleDefault:self.handleDefault
        };

        return (
            <Navbar fluid={true} className={"portal-navbar "+(expanded?"expanded":"")} expanded={expanded} onToggle={this.onToggle.bind(this)}>

                <Brand>
                    <a href="javascript:;">
                        <img src={require('static/images/logo_zh_CN.svg')} className="portal-logo" />
                    </a>
                </Brand>

                <Nav pullRight className="u-menu-list" onClick={self.handleClick.bind(this)}>
                    <NavItem>
                        <a id="taskCenterBox" value="taskcenter"  onClick={(e)=>self.handleDefault(e)} data-ref="taskcenter" name="任务中心" title="任务中心" href={`${GROBAL_HTTP_CTX}/index-view.html#/taskcenter`} className="navbar-avatar" titlekey="任务中心" >
                            <div className="u-badge">
                                <i className="pap pap-task"></i>
                            </div>
                        </a>
                    </NavItem>
                    <NavItem>
                        <a id="messageCount" value="msgCenter" onClick={(e)=>self.handleDefault(e)} data-ref="msgCenter" name="消息中心" title="消息中心" href={`${GROBAL_HTTP_CTX}/index-view.html#/msgCenter`} className="navbar-avatar" >
                            <div className="u-badge" data-badge="0">
                                <i className="pap pap-massage"></i>
                            </div>
                        </a>
                    </NavItem>
                    <UserMenus {...UserMenuObj}  />
                </Nav>


                <Nav pullRight className="portal-nav" onClick={self.showMenu.bind(self)}>


                    <div id="bs-example-navbar-collapse-9" className="collapse navbar-collapse navbar-right">




                        <ul className="nav navbar-nav">
                            <li className="dropdown" >
                                <a role="button" id="username"  aria-expanded="false" href="javascript:void (0);" data-toggle="dropdown" className="navbar-avatar dropdown-toggle">

                                    <span className="avatar-name"> {decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userName')))} </span>
                                    <span className="iconfont icon-arrowdown"></span>
                                    <span className="avatar-icon">
                                            <img src={`${GROBAL_HTTP_CTX}`+decodeURIComponent(decodeURIComponent(cookie.load('_A_P_userAvator'))).replace(/\.\/images/,'\/images')} />
                                        </span>
                                </a>

                                <div role="menu" className={'dropdown-menu user-menu'}>
                                    <UserMenus {...UserMenuObj}  />
                                </div>
                            </li>
                        </ul>
                    </div>
                </Nav>
            </Navbar>
        )
    }
}

export default  App;