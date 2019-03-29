import React,{Component} from "react";
import mirror, { connect,actions } from 'mirrorx';
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';
import {Select} from 'tinper-bee';
const Option = Select.Option;
class HeaderLeft extends Component {
    constructor(props,context) {
        super(props,context);
        this.state = {
          sideSearchList: []
        }
    }

    svgClick() {
      const {sideBarShow} = this.props;
      actions.app.updateState({
        sideBarShow: !sideBarShow
      })
      // $('.left-side-bar ').an
    }
    searchInput = (val) => {

    }
    searchSideClick = () => {

    }
    themeChange = (val) => {
      this.props.headerRightOper.themeChange(val);
    }
    render() {
      let self = this;
      let {sideBarShow,leftExpanded,themeObj,searchSideVal} = this.props;
      let selectVal = localStorage.getItem('themeVal');
      if(!selectVal) {
        selectVal = '2'
      }
      let obj = {
        width:"18px",
        height:"18px"
      }
      let obj1 = {
        width:"24px",
        height:"24px"
      }
        return (
            <div className="header-left">
              <div className={[sideBarShow?"header-svg header-svg-red":"header-svg",themeObj.sideShowPosition?"header-svg-show":""].join(" ")} onClick={self.svgClick.bind(this)}>
                {sideBarShow || themeObj.headerTheme==="dark"?
                <img src={require(`static/images/icon_menu_white.svg`)}  />
                :<img src={require(`static/images/icon_menu.svg`)}  />
                }
                { /*<svg className="icon" style={sideBarShow?obj1:obj}>
               <use xlinkHref={sideBarShow?'#icon-logo1':'#icon-logo'}></use>
                </svg>*/}
              </div>
              <div className="header-search">
                <input type="search" placeholder={this.props.placeholder} value={searchSideVal} onChange={this.searchInput}/>
                <i className = "uf uf-search" onClick={this.searchSideClick} />
              </div>
              {
                <Select
                  defaultValue='0'
                  value={selectVal}
                  style={{ marginRight: 6 , width: 100}}
                  onChange={this.themeChange}
                  showSearch={true}
                >
                  <Option value="2">浅色主题</Option>
                  <Option value="1">深色主题</Option>
                  <Option value="0">中兴</Option>
                </Select>
              }
            </div>
        );
    }
}
export default HeaderLeft;
