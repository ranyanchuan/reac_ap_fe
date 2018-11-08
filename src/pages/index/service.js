import request from "utils/request";
import axios from "axios";

//定义接口地址
const URL = {
    "GET_MENU":  `${GROBAL_HTTP_CTX}/appmenumgr/sidebarList?r=`+Math.random(),
    "GET_USER_MENU":  `${GROBAL_HTTP_CTX}/moreMenu/list?r=`+Math.random()
};

/**
 * 获取菜单信息
 * @param {*} params
 */
export const getList = (params) => {
    let url =URL.GET_MENU+'?1=1';
    return request(url, {
        method: "get"
    });
};

/**
 * 获取用户菜单数据
 * @param {*} params
 */
export const loadUserMenuList = (params) => {
    return request(URL.GET_USER_MENU, {
        method: "get"
    });
}


