import React,{Component} from "react";
import cookie from "react-cookie";
import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {Navbar,Menu,Badge,Tile,Icon,Tooltip,Select} from 'tinper-bee';
import UserMenus from 'components/UserMenu/UserMenu';
import Tenant from 'layout/Tenant/Tenant';
import { actions } from 'mirrorx';
const Nav = Navbar.Nav;
const Option = Select.Option;
class HeaderRight extends Component {
    constructor(props) {
        super(props);
        actions.app.getLanguageList();
    }
    maxfunc(e) {
      // debugger;
      // console.log('syt',this.props);
      this.props.headerRightOper.maxfunc(e);
    }
    minifunc(e) {
      this.props.headerRightOper.minifunc(e);
    }
    handleDefault(e) {
      this.props.headerRightOper.handleDefault(e);
      this.props.handleClick(e);
    }
    handleClick(e) {
      this.props.headerRightOper.handleClick(e);
    }
    componentWillMount () {

    }
    handleChange = (val) => {
      actions.app.setLocaleParam(val);
    }
    /**
     * 语种切换下拉
     */
    initOption = (type,data) =>{
        let body=[];
        data.map((option,i) => (
            body.push(<Option className={"login-"+type+"-option"} value={option.code} key={option.code}>{option.name}</Option>)
        ));
        return body;
    }
    render() {
      var self = this;
      let {intl, unreadMsg, UserMenuObj,maxed,langCode,langList} = this.props;
      console.log(langList);
        return (
            <div className="header-right">
              {/*<Tenant {...UserMenuObj}/>*/}
              {cookie.load('loginChannel') ==='yht'?<div  className="header-right-tenant" onClick={(e)=>self.handleClick(e)}>
                      <Tenant {...UserMenuObj} />
                  </div>:""}
                {
                  <Select
                    defaultValue={langCode}
                    style={{ marginRight: 6 , width: 100}}
                    onChange={this.handleChange}
                    showSearch={true}
                  >
                    {this.initOption("lang",langList)}
                  </Select>
                }
                {!maxed ?
                  <a id="maxBox" onClick={(e)=>self.maxfunc(e)}   data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-maxmize" style={{"fontSize":"18px"}}></Icon>
                  </a>:
                  <a id="maxBox" onClick={(e)=>self.minifunc(e)} data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.max'})} title={intl.formatMessage({id: 'tabs.header.max'})}  className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.max'})} >
                    <Icon type="uf-minimize" style={{"fontSize":"18px"}}></Icon>
                  </a>
                }
                <a id="taskCenterBox" value="taskcenter" onClick={(e)=>self.handleDefault(e)} data-ref="taskcenter" name={intl.formatMessage({id: 'tabs.header.task'})} title={intl.formatMessage({id: 'tabs.header.task'})} href={`${GROBAL_HTTP_CTX}/index-view.html#/taskcenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.task'})} >
                  <i className="pap pap-task"></i>
                </a>
                <a id="messageCount" value="msgCenter" onClick={(e)=>self.handleDefault(e)} data-ref="msgCenter" name={intl.formatMessage({id: 'tabs.header.message'})} title={intl.formatMessage({id: 'tabs.header.message'})} href={`${GROBAL_HTTP_CTX}/index-view.html#/msgCenter`} className="navbar-avatar" titlekey={intl.formatMessage({id: 'tabs.header.message'})}>
                  <i className="pap pap-massage u-badge" data-badge={unreadMsg} ></i>
                </a>
              <UserMenus {...UserMenuObj}/>
            </div>
        );
    }
}
export default HeaderRight;
