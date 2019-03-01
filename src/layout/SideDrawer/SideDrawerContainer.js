import React, { Component } from "react";
import { Drawer } from "antd";
/**
 * 侧拉功能 容器
 */
class SideDrawer extends Component {
    constructor(props) {
        super(props);
    }
    onClose = () => {
        this.props.onChange(false);
    };
    render() {
        let {
            open,
            children,
            width,
            className,
            placement = "right"
        } = this.props;
        return (
            <Drawer
                className={className}
                getContainer={
                    document.getElementsByClassName("nc-workbench-drawer")[0]
                }
                maskClosable={true}
                closable={false}
                width={width}
                maskStyle={{ backgroundColor: "unset" }}
                visible={open}
                onClose={this.onClose}
                placement={placement}
            >
                {children}
            </Drawer>
        );
    }
}
export default SideDrawer;
