import React from 'react';
import mirror, { connect } from 'mirrorx';
import {intlShape, injectIntl, defineMessages} from 'react-intl';

// 组件引入
import App from './components/AppRoot/AppRoot';
import Header from 'components/Header/Header';
import Sidebar from 'components/Sidebar/Sidebar';
import TabBox from 'components/TabBox/TabBox';

// // 数据模型引入
import model from './model'

mirror.model(model);

// 数据和组件UI关联、绑定
export const ConnectedApp = connect( state => state.app, null )(injectIntl(App));
// 组件引入
export const ConnectedHeader = connect( state => state.app, null )(injectIntl(Header));
export const ConnectedSidebar = connect( state => state.app, null )(injectIntl(Sidebar));
export const ConnectedTabBox = connect( state => state.app, null )(injectIntl(TabBox));
