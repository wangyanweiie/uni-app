import { SUCCESS_CODE, NOT_LOGIN } from '@const/common';
import { clearToken } from '@utils/uni-storage';

// 后端ip端口号，可修改
const baseUrl = process.env.VUE_APP_BASE_URL;

/**
 * 请求错误的回调
 * @param {Object} res 返回值
 */
function errorHandle() {
    // TODO: 统一错误提示未完成
    uni.showToast({
        title: '网络错误或服务器错误',
        icon: 'none',
        duration: 2000,
    });
}

/**
 * 请求成功的回调
 * @param {Object} res 返回值
 */
function responseHandle(res, resolve) {
    const { code } = res.data;
    // code 1xx success
    if (Math.floor(code / 100) === 1) {
        switch (code) {
            // 120
            case SUCCESS_CODE:
                return resolve(res.data);
            // TODO: 110, 100 未处理，统一返回true
            default:
                return resolve(true);
        }
    } else {
        switch (code) {
            // -997 未登录处理
            case NOT_LOGIN:
                uni.showToast({
                    title: '请重新登录',
                    icon: 'none',
                    mask: true,
                    duration: 2000,
                });
                clearToken();
                // uni.setStorageSync('token', '');
                uni.navigateTo({ url: '/pages/login/index' });
                return resolve(false);
            default:
                // TODO: 其余未处理，统一返回未知错误
                uni.showToast({
                    title: res.data.message || '未知错误',
                    icon: 'none',
                    duration: 2000,
                });
                return resolve(false);
        }
    }
}

/**
 * 接口函数
 * @param {string} method http methods
 * @param {string} url api地址
 * @param {Object | null} data 参数
 */
function http(method = 'GET', url = '', data) {
    const token = uni.getStorageSync('token');
    // loading
    uni.showLoading({
        title: '加载中',
        mask: true,
    });

    return new Promise((resolve) => {
        uni.request({
            url: baseUrl + url,
            method,
            data,
            dataType: 'json',
            header: {
                'v-token': token,
            },
            success: (res) => {
                responseHandle(res, resolve);
            },
            fail: (res) => {
                errorHandle(res);
            },
            complete: () => {
                // 隐藏loading
                uni.hideLoading();
            },
        });
    });
}

export function get(url, data) {
    return http('GET', url, data);
}

export function post(url, data) {
    return http('POST', url, data);
}
