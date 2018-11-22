import React,{Component} from 'react';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip} from 'tinper-bee';
import mirror, { connect,actions } from 'mirrorx';
import cookie from 'react-cookie';
import {Router} from 'director/build/director';
window.router = new Router();
require('components/viewutil/viewutil');


const SubMenu = Menu.SubMenu;
const SideContainer = Menu.SideContainer;
const Header = Navbar.Header;


class App extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            isOpenTab: true,
            clientHeight:document.body.clientHeight,
        };
        this.delTrigger();
        this.showMenu = this.showMenu.bind(this);
        this.handleClick = this.handleClick.bind(this);
        window.handleClick = this.handleClick;
    }


    delTrigger(){
        var self = this;
        $('body').on('del',function(e,data){
            sessionStorage['tabs'] = JSON.stringify(data.menus);
            sessionStorage['current'] = JSON.stringify({
                current:data.current
            });
            self.setState(data);
        });
        window.confirmDel = function (data) {
            $('body').trigger('del',[data]);
        }
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
    handleDefault(e,isDefault) {
        isDefault = (isDefault=="_blank")?false:true;
        if(this.state.isOpenTab&&isDefault){
            //dom.href = 'javascript:;'
            e.preventDefault();
        }
    }

    handleClick(e,reload) {
        //判断是否点击子菜单,1:当前子菜单，2:2级别子菜单。。。
        let {menus,current,showNotice} = this.props;

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
                    })
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

        //当存在相同id菜单的时候，不创建
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
            tabNum:menuObj.length,
            current:options.id
        });

    }
    getTabs () {

        if(!window.sessionStorage){
            alert('This browser does NOT support sessionStorage');
            return false;
        }


        var userId = sessionStorage['userId'];

        if(userId!=undefined&&userId!=cookie.load('_A_P_userId')){
            //sessionStorage.clear();
        }

        sessionStorage['userId'] = cookie.load('_A_P_userId');


        var menus = sessionStorage['tabs']!=undefined?JSON.parse(sessionStorage['tabs']):[];
        var current = sessionStorage['current']!=undefined?JSON.parse(sessionStorage['current']):'';

        actions.app.updateState(
            {
                menus:menus,
                tabNum:menus.length,
                current:current.current
            }
        )

        return menus;
    }



    showMenu(e) {

        var state = this.state.userMenu;
        this.setState({"userMenu":!state})
    }

    //IE下 array.find（）方法不可用
    myfilter(arr1,arr2) {
        if(arr2.length == 0 || !arr2) {
            return arr1[0];
        }

        for(var i=0;i<arr1.length;i++)
        {
            if(arr2.indexOf(arr1[i].toString())==-1)
            {
                return arr1[i];
            }
        }
        return false;
    }
    getAncestorKeys(key) {
        const map = {
            sub3: ['sub2']
        };
        return map[key] || [];
    }
    sessionStorage(openKeys){
        if(sessionStorage&&openKeys){
            sessionStorage['openKeys'] = openKeys;
        }
        else {
            return sessionStorage['openKeys'];
        }
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
    setMenu(response){
        var self = this;

        var url = decodeURIComponent(decodeURIComponent(location.hash));

        var obj = sessionStorage['current']!=undefined?JSON.parse(sessionStorage['current']):'';

        if(obj){
            this.state.current = obj.current;

            return false;
        }

        var data = response.data.data||[];

        data.map(function (item,index) {

            if(Array.isArray(item.children)&&item.children.length>0){

                item.children.map(function(it,index){
                    let selected = url.indexOf(it.location||'null')>=0?it.id:"";
                    if(selected){
                        self.setState({
                            current:selected
                        })
                    }
                    if(it==0){
                        self.setState({
                            firstUrl:item.location
                        })
                    }
                    // it.children.map(function(itit,index2){
                    //     let selected = url.indexOf(itit.location||'null')>=0?itit.id:"";
                    //     if(selected){
                    //         self.setState({
                    //             current:selected
                    //         })
                    //     }
                    //     if(itit==0){
                    //         self.setState({
                    //             firstUrl:it.location
                    //         })
                    //     }
                    // });
                });
            }
            else {

                let selected = url.indexOf(item.location||'null')>=0?item.id:"";
                if(selected){
                    self.setState({
                        current:selected
                    });

                    if(index==0){
                        self.setState({
                            firstUrl:item.location
                        })
                    }
                }
                else {
                    if(index==0){
                        self.setState({
                            firstUrl:item.location,
                            current:item.id
                        })
                    }

                }
            }
        });
    }

    resizeIfr (){
        var self = this;

        let {reload,current,currentRouter} = this.props;


        var ifr = document.getElementById(current);

        //iframe刷新
        if(reload){

            //ifr.contentWindow.location.href = self.state.currentRouter?self.state.currentRouter:ifr.contentWindow.location.href;
            //autodiv.attr('src',currentRouter?currentRouter:ifr.contentWindow.location.href);
            ifr.src = currentRouter?currentRouter:ifr.contentWindow.location.href
        }

        function autoH() {
            var addh = document.body.clientHeight - 82 ;
            ifr.height = addh;
            ifr.style.overflow = "auto"
        }
        if(current){
            autoH();

            window.onresize =function(){
                autoH();
            }
        }
    }

    componentDidUpdate (){
        var self = this;
        self.resizeIfr();
        self.menubar();
    }

    componentDidMount(){
        var self = this;
        self.resizeIfr();
        self.menubar();
        self.confirm();
    }

    async componentWillMount() {
        var self = this;

        //获取加载的菜单信息
        var menus = await actions.app.loadList();
        // self.setMenu(menus);
        self.getTabs();
        window.menus = menus;
        window.getBreadcrumb = function (id) {
            var menus = window.menus;
            var n1,n2,n3;

            $.each(menus,function (i,item) {
                if(id==item.id){
                    n1 = item;
                    return false;
                }
                if(item.children&&item.children.length>0){
                    $.each(item.children,function (t,items) {
                        if(id==items.id){
                            n2 = items;
                            n1 = item;
                            return false;
                        }

                        if(items.children&&items.children.length>0){
                            $.each(items.children,function (tt,itemss) {
                                if(id==itemss.id){
                                    n3 = itemss;
                                    n2 = items;
                                    n1 = item;
                                    return false;
                                }
                            })
                        }
                    })
                }
            });

            return (function () {
                var data = []
                $.each([n1,n2,n3],function(i,item){
                    if(item){
                        data.push(item.name)
                    }
                })

                return data;
            })();
        };
        self.initRouter();
    }

    initRouter() {
        var self = this;
        let {menu,menus} = this.props;
        var router = window.router;
        router.init();
        //获取第一个节点数据


        //if(this.state.menu.length==0) return false;

        // this.state.menu[0].children = this.state.menu[0].children==null?[]:this.state.menu[0].children;

        // var item = this.state.menu[0].children!=null&&this.state.menu[0].children.length==0?this.state.menu[0]:this.state.menu[0].children[0];
        // var blank = item.openview=="newpage"?"_blank":"";
        // var oUrl = '',uri = encodeURIComponent(encodeURIComponent(item.location));
        // if(blank){
        //     oUrl = '#/ifrNoHead/' + uri;
        // }else{
        //     oUrl = '#/ifr/' + uri;
        // }
        // var url = oUrl.replace('#','');

        var item = menu[0]?menu[0]:{
            "location" : "pages/default/index.js",
            "name" : "首页",
            "menustatus" : "Y",
            "children" : null,
            "icon" : "iconfont icon-C-home",
            "openview" : "curnpage",
            "menuId" : "M0000000000002",
            "urltype" : "plugin",
            "id" : "index",
            "isDefault" : null,
            "licenseControlFlag" : 0
        };


        if (window.location.hash == ''|| window.location.hash == '#/') {

            if(this.state.isOpenTab){
                if(menus.length==0){
                    //true设定加载第一个tab
                    var options = {
                        title:item.name,
                        router:self.formmaterUrl(item),
                        id:item.id
                    };
                    self.createTab(options);
                }
            }
            else {
                //router.dispatch('on', url);
            }
        }
        else {
            router.dispatch('on', window.location.hash.replace('#',''));
        }
    }
    onTitleMouseEnter(e,domEvent){
        var dom = ($(e.domEvent.target).closest('li'));
        var h = document.body.clientHeight;

        this.setState({
            clientHeight:h
        });

        setTimeout(function () {

            var menu = dom.find('.u-menu');
            var arrow = dom.find('.arrow-menu');
            if(parseInt(dom.offset().top)+parseInt(menu.height())>h){

                if(parseInt(menu.height())>parseInt(dom.offset().top)){
                    menu.css({'bottom':-(h-parseInt(dom.offset().top)-50-20),'top':'inherit'});
                    arrow.css({'bottom':(h-parseInt(dom.offset().top)-50)+15-20,'top':'inherit'});
                }
                else {
                    menu.css({'bottom':"0",'top':'inherit'});
                    arrow.css({'bottom':"14px",'top':'inherit'})
                }
            }
            else {
                menu.css({'bottom':"inherit",'top':'0'});
                arrow.css({'bottom':"inherit",'top':'14px'})
            }
        },0)
    }
    menubar() {
        var cH = document.body.scrollHeight-60;
        var sH = this.refs.uMenu.clientHeight;
        if(sH>cH){
            this.refs.moreBar.style.display = 'block'
        }
    }
    scrollMenu(value,e){

        let {curNum,num} = this.props;

        var h  = document.body.clientHeight-60;
        var showNum = parseInt(h/50);

        curNum =  curNum+value;

        if(curNum<0){
            curNum = 0;
            $('.arrow-up').addClass('lock');
            return false;
        }
        //fix: add 1 fake element
        else if(curNum>num-showNum) {
            curNum=num-showNum;
            $('.arrow-down').addClass('lock');
            return false;
        }
        else {
            $('.arrow-down,.arrow-up').removeClass('lock');
        }

        actions.app.updateState({
            curNum:curNum
        })
    }

    confirm(){
        if(getBrowserVersion()=='IE9'){
            return false;
        }
        window.onbeforeunload = function() {
            var tabs = JSON.parse(sessionStorage['tabs'])
            if(tabs.length>1) {
                return '关闭后您打开的页签数据会自动清空'
            }
        };
        window.onunload = function (event) {

            if(event.clientX<=0 && event.clientY<0) {
                sessionStorage.clear();
            }
            else {
                if(location.href.match(/login\/login.html/ig)!=null){
                    sessionStorage.clear();
                }
            }

        }
    }

    render() {
        var self = this;
        const {expanded,menu,submenuSelected,curNum,current} = this.props;
        var isSeleted = submenuSelected;

        return (
            <SideContainer onToggle={this.onToggle.bind(this)} expanded={expanded}>

                <Header>
                    <div className="toggle-wrap" >
                        <button type="button" onClick={this.onToggle.bind(this)} className="u-navbar-toggle show collapsed"><span className="uf uf-navmenu-light"></span></button>
                        <span className="toggle-text"></span>
                    </div>
                </Header>
                <div className="sidebar-content" ref="uMenu">
                    <Menu onClick={this.handleClick.bind(this)} className="u-menu-max1"  style={{marginTop:'-'+curNum*50}}  mode="vertical" >


                        {
                            menu.map(function (item) {

                                let blank = item.openview=="newpage"?"_blank":"";
                                var noSecond = '';
                                var curHeight = 0;

                                if(Array.isArray(item.children)&&item.children.length>0){
                                    let list = [];
                                    var menulist = [[],[],[],[],[],[],[],[],[]];
                                    var pages = 0;

                                    let title = (<a href="javascript:;" key={item.menuId} className="first-child" name={item.name}><i className={'icon '+item.icon}></i><span><label className="uf uf-triangle-left"></label>{item.name}</span></a>);


                                    item.children.map(function(it){
                                        let blank =it.openview=="newpage"&&it.urltype=='url'?"_blank":"";


                                        if(Array.isArray(it.children)&&it.children.length>0){
                                            let list2 = [];
                                            let title = (<a href="javascript:;" key={it.id} className="child-title"><i className={'icon-child'}></i><span>{it.name}</span></a>);
                                            noSecond = 'no-second-menu';

                                            it.children.map(function(itit){
                                                let blank =itit.openview=="newpage"&&itit.urltype=='url'?"_blank":"";

                                                list2.push(<li><a target={blank} value={itit.id} onClick={(e)=>self.handleDefault(e,blank)} ref={itit.id} name={itit.name}  href={self.formmaterUrl(itit)}>{itit.name}</a></li>)
                                            });

                                            curHeight = Math.ceil(it.children.length/3)*25+52 + curHeight;


                                            if(curHeight > self.state.clientHeight-60){
                                                pages = pages +1;
                                                curHeight = 0;
                                                menulist[pages].push(
                                                    <div className={'menu-popup'}>
                                                        {title}
                                                        <div className="third-menu-content">
                                                            <ul className="third-menu-list">
                                                                {list2}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                menulist[pages].push (
                                                    <div className={'menu-popup'}>
                                                        {title}
                                                        <div className="third-menu-content">
                                                            <ul className="third-menu-list">
                                                                {list2}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                        }
                                        else {

                                            curHeight = 46+ curHeight;

                                            let title = (<a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} href={self.formmaterUrl(it)}><i className={'icon '+it.icon}></i><span>{it.name}</span></a>);


                                            if(curHeight > document.body.clientHeight-60){
                                                pages = pages+1;
                                                curHeight = 0;
                                                menulist[pages].push(
                                                    <div className={'menu-popup'}>
                                                        <a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} ref={it.id} name={it.name} href={self.formmaterUrl(it)}>{it.name}</a>
                                                    </div>
                                                )
                                            }
                                            else {
                                                menulist[pages].push(
                                                    <div className={'menu-popup'}>
                                                        <a target={blank} value={it.id} onClick={(e)=>self.handleDefault(e,blank)} ref={it.id} name={it.name} href={self.formmaterUrl(it)}>{it.name}</a>
                                                    </div>
                                                )
                                            }

                                        }

                                    });


                                    var selected = item.id == isSeleted?"u-menu-submenus-selected":"";


                                    return (
                                        <SubMenu onTitleMouseEnter={self.onTitleMouseEnter.bind(self)} key={item.menuId} className={'second-menu '+selected+ ' '+ noSecond +' menu-cloum-'+pages} children={item.children} title={title}>
                                            <li className="arrow-menu"></li>
                                            {/*{menulist}*/}
                                            {
                                                menulist.map(function(ite,i){
                                                    ite = ite.length!=0?<li key={'ite'+i} className="u-menu-list">{ite}</li>:ite;
                                                    return (
                                                        ite
                                                    )
                                                })
                                            }
                                        </SubMenu>
                                    )
                                }
                                else {
                                    let blank =item.openview=="newpage"?"_blank":"";

                                    if(item.id == 'index'){
                                        return false;
                                    }

                                    let title = (
                                        <a target={blank} key={item.id} value={item.id} className="first-child" onClick={(e)=>self.handleDefault(e,blank)} ref={item.id} href={self.formmaterUrl(item)} name={item.name}><i className={'icon '+item.icon}></i><span ><label className="uf uf-triangle-left"></label>{item.name}</span></a>
                                    );
                                    return (
                                        <Menu.Item key={item.id} >{title}</Menu.Item>
                                    )
                                }
                            })
                        }
                    </Menu>
                </div>
                <div className="more-bar" ref="moreBar" style={{display:'none'}}>
                    <div className="arrow-up lock" title="通过滚动鼠标来移动菜单" onClick={this.scrollMenu.bind(this,-1)}>
                        <i className="uf uf-2arrow-up" />
                    </div>
                    <div className="arrow-down" title="通过滚动鼠标来移动菜单" onClick={this.scrollMenu.bind(this,1)}>
                        <i className="uf uf-2arrow-down" />
                    </div>
                </div>
            </SideContainer>
        )
    }
}

export default App;
