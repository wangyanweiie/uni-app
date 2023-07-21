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
    '异常提示' = 300,
    '违反数据规整性' = 200,
    '请求成功' = 120,
}

export function HTTP(data: any, method: HttpType, url: string, loading = true) {
    // 获取 token
    const token = uni.getStorageSync('token');

    if (loading) {
        showLoading('请求中', loading);
    }

    return new Promise((resolve) => {
        uni.request({
            url: BASE_URL + url,
            method,
            data,
            dataType: 'json',
            header: {
                'v-token': token,
            },
            success: (res) => {
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
            return;
            break;

        case CODE_STATUS['异常提示']:
        case CODE_STATUS['违反数据规整性']:
            showToast(res.data.message);
            return resolve(false);

        case CODE_STATUS['请求成功']:
            return resolve({ ...res.data });
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
    return HTTP(data, 'GET', url);
}

/**
 * post请求
 */
export function post(url: string, data?: any): Promise<any> {
    return HTTP(data, 'POST', url);
}
