import React,{Component} from "react";
// import {FormattedMessage, FormattedDate, FormattedNumber} from 'react-intl';

class HeaderLeft extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header-left">
              <div className="header-svg">
                <svg className="icon" style={{"width":"22px",height:"22px"}}>
                <use xlinkHref='#icon-logo'></use>
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
