import type { HttpType } from '../interface/http';
import { clearToken } from './uni-storage';
import { hideLoading, showLoading, showToast } from './messageTip';

/**
 * 服务地址
 */
const BASE_URL = import.meta.env.VITE_API_URL as string;

/**
 * 请求状态码
 */
enum CODE_STATUS {
    '未登录' = -997,
    '请求成功' = 120,
}

export function HTTP(method: HttpType, url: string, data: any, loading = true) {
    // 获取 token
    const token = uni.getStorageSync('token');

    if (loading) {
        showLoading('请求中', loading);
    }

    return new Promise(resolve => {
        uni.request({
            url: BASE_URL + url,
            method,
            data,
            dataType: 'json',
            header: {
                'v-token': token,
            },
            success: res => {
                handleResponse(res, resolve);
            },
            fail: () => {
                handleError();
            },
            complete: () => {
                hideLoading();
            },
        });
    });
}

/**
 * 成功处理
 */
function handleResponse(res: any, resolve: any) {
    const { code } = res.data;

    if (Math.floor(code / 100) === 1) {
        switch (code) {
            // 120
            case CODE_STATUS['请求成功']:
                return resolve(res.data);

            // 110 与 100，统一返回 true
            default:
                return resolve(true);
        }
    } else {
        switch (code) {
            case CODE_STATUS['未登录']:
                clearToken();

                uni.showToast({
                    title: '登录失效，请重新登录',
                    icon: 'none',
                    mask: true,
                    complete: () => {
                        uni.navigateTo({ url: '/pages/login/index' });
                    },
                });

                return resolve(false);

            default:
                // 其余未处理，统一返回未知错误
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
 * 错误处理
 */
function handleError() {
    showToast('网络错误或服务器错误');
}

/**
 * get请求
 */
export function get(url: string, data?: any) {
    return HTTP('GET', url, data);
}

/**
 * post请求
 */
export function post(url: string, data?: any): Promise<any> {
    return HTTP('POST', url, data);
}
