import axios, { AxiosResponse } from 'axios';
import { LOCAL_BASE_URL_KEY, LOCAL_TOKEN_KEY } from '@/constant/global';
import { getStorage } from '@/utils/uni-storage';
import { showToast } from './uni-message';
import axiosAdapterUniapp from 'axios-adapter-uniapp';

/**
 * 接口返回类型
 */
interface ResponseData<T = any> {
    code: number;
    data?: T;
    message?: string;
}

/**
 * 后端返回 code
 */
enum ResponseCode {
    /**
     * 成功
     */
    SUCCESS = 120,
    /**
     * 参数错误
     */
    PARAMS_ERROR = 400,
    /**
     * 无权限
     */
    NOT_ALLOWED = 401,
    /**
     * 未登录
     */
    NOT_VERIFIED = 407,
    /**
     * 登录过期
     */
    EXPIRE = 416,
    /**
     * 服务端错误
     */
    ERROR = 500,
}

/**
 * 连接错误信息提示
 */
export enum HTTPErrorNotice {
    /**
     * 连接超时
     */
    TIMEOUT = '连接超时',

    /**
     * 未知错误
     */
    UNKNOWN = '未知错误',

    /**
     * 未登录
     */
    NOT_VERIFIED = '未登录',

    /**
     * 404
     */
    NOT_FOUND = '访问地址不存在',

    /**
     * 服务端错误
     */
    SERVER_ERROR = '服务器错误',

    /**
     * 网络连接错误
     */
    NETWORK_ERROR = '网络错误，请检测本地或访问地址是否正常。',

    /**
     * 登录过期
     */
    EXPIRE = '登录过期，即将跳转至登录页',

    /**
     * 未授权
     */
    NOT_ALLOWED = '未授权',

    /**
     * 参数错误
     */
    PARAMS_ERROR = '参数错误',
}

/**
 * 创建 axios 对象
 */
const service = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    timeout: 60 * 1000 * 5,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
    // 适配器
    adapter: axiosAdapterUniapp,
});

/**
 * 配置请求拦截
 */
service.interceptors.request.use(
    config => {
        const token = getStorage(LOCAL_TOKEN_KEY);
        const baseUrl = getStorage(LOCAL_BASE_URL_KEY);

        // 设置 token
        if (token && config.headers) {
            config.headers['v-token'] = token;
        }

        // 设置 baseurl
        if (baseUrl && config.url) {
            config.url = baseUrl + config.url;
        }

        return config;
    },
    error => Promise.reject(error),
);

/**
 * 配置响应拦截
 */
service.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => {
        const { code, data, message } = response.data;

        console.log(response.data);

        // 成功
        if (code === ResponseCode.SUCCESS) {
            return Promise.resolve(data ?? true);
        }

        // 错误
        switch (code) {
            case ResponseCode.ERROR:
                showToast(message ?? HTTPErrorNotice.UNKNOWN);
                break;

            case ResponseCode.PARAMS_ERROR:
                showToast(message ?? HTTPErrorNotice.PARAMS_ERROR);
                break;

            case ResponseCode.EXPIRE:
                uni.showToast({
                    title: HTTPErrorNotice.EXPIRE,
                    icon: 'none',
                    mask: true,
                    complete: () => {
                        uni.navigateTo({ url: '/pages/login/index' });
                    },
                });
                break;

            case ResponseCode.NOT_VERIFIED:
                uni.showToast({
                    title: HTTPErrorNotice.NOT_VERIFIED,
                    icon: 'none',
                    mask: true,
                    complete: () => {
                        uni.navigateTo({ url: '/pages/login/index' });
                    },
                });
                break;

            case ResponseCode.NOT_ALLOWED:
                showToast(HTTPErrorNotice.NOT_ALLOWED);
                break;

            default:
                showToast(HTTPErrorNotice.UNKNOWN);
                break;
        }

        return Promise.resolve(false);
    },
    error => {
        const statusCode = error.response?.status;

        if (!statusCode) {
            if (error.message.indexOf('timeout') >= 0) {
                showToast(HTTPErrorNotice.TIMEOUT);
            } else if (error.message.indexOf('Network Error') >= 0) {
                showToast(HTTPErrorNotice.NETWORK_ERROR);
            } else {
                showToast(HTTPErrorNotice.UNKNOWN);
            }

            return Promise.resolve(false);
        }

        // 非响应错误处理
        switch (statusCode) {
            case 404:
                showToast(HTTPErrorNotice.NOT_FOUND);
                break;
            case 500:
                showToast(HTTPErrorNotice.SERVER_ERROR);
                break;
            default:
                showToast(HTTPErrorNotice.UNKNOWN);
                break;
        }

        return Promise.resolve(false);
    },
);

/**
 * POST
 */
const post = service.post;

/**
 * GET
 */
const get = service.get;

/**
 * PUT
 */
const put = service.put;

/**
 * DELETE
 */
const del = service.delete;

export { post, get, put, del };
