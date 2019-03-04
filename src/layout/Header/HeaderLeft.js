import React,{Component} from "react";
import mirror, { connect,actions } from 'mirrorx';
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';

class HeaderLeft extends Component {
    constructor(props,context) {
        super(props,context);
    }
    svgClick() {
      const {sideBarShow} = this.props;
      actions.app.updateState({
        sideBarShow: !sideBarShow
      })
      // $('.left-side-bar ').an

    }
    render() {
      let self = this;
      let {sideBarShow} = this.props;
        return (
            <div className="header-left">
              <div className={sideBarShow?"header-svg header-svg-red":"header-svg"} onClick={self.svgClick.bind(this)}>
                <svg className="icon" style={{"width":"22px",height:"22px"}}>
                <use xlinkHref={sideBarShow?'#icon-logo1':'#icon-logo'}></use>
                </svg>
              </div>
              <div className="header-search">
                <input type="search" placeholder={this.props.placeholder}/>
                <i className = "uf uf-search"/>
              </div>
            </div>
        );
    }
}
export default HeaderLeft;
