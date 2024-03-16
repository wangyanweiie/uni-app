import { getStorage } from '@/utils/uni-storage';

/**
 * 本地存储 key 值
 */
export const LOCAL_BASE_URL_KEY = 'baseUrl';
export const LOCAL_TOKEN_KEY = 'token';
export const LOCAL_USER_INFO_KEY = 'userInfo';
export const LOCAL_PERMISSION_KEY = 'permission';
export const LOCAL_LANGUAGE_KEY = 'language';

/**
 * 当前环境
 */
export const ENV = import.meta.env.MODE;

/**
 * 上传接口
 */
export const UPLOAD_URL = `${getStorage(LOCAL_BASE_URL_KEY) || (import.meta.env.VITE_API_URL as string)}/api/upload`;

/**
 * 防抖时间
 */
export const DEBOUNCE_DURATION = 2000;
