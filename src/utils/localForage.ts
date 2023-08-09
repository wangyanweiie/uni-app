// https://localforage.docschina.org/#localforage
import localForage from 'localforage';

/**
 * 将 data 存储在本地缓存中指定的 key 中，会覆盖掉原来该 key 对应的内容，这是一个同步接口。
 * @param key 属性名称
 * @param data 要保存的数据
 */
export function saveForage(key: string, data: unknown) {
    localForage.setItem(key, data);
}

/**
 * FIXME: async/await 后返回到页面接收的仍然是 promise？？
 * 从本地缓存中同步获取指定 key 对应的内容。
 * @param key 取数据的key
 * @returns
 */
export async function getForage(key: string) {
    return await localForage.getItem(key);
}

/**
 * 从本地缓存中同步获取指定 key 对应的内容。
 * @param key 取数据的key
 * @returns
 */
export function removeForage(key: string) {
    localForage.removeItem(key);
}

/**
 * 全部清除
 */
export function clearForage() {
    localForage.clear();
}
