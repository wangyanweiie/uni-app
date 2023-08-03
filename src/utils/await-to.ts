/**
 * await to
 * @param promise 请求方法
 * @param errorExt 错误提示
 */
export function to(promise?: any, errorExt?: any) {
    return promise
        .then((data: any) => [null, data])
        .catch((err: any) => {
            if (errorExt) {
                Object.assign(err, errorExt);
            }

            return [err, undefined];
        });
}
