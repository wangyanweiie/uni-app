/**
 * 提示信息
 * @param {string} message 提示信息
 */
export function showToast(title = '未知错误', icon = 'none', mask = false, duration = 1500) {
    uni.showToast({
        title,
        icon: icon as 'none' | 'success' | 'loading' | 'error' | 'fail' | 'exception' | undefined,
        mask,
        duration,
    });
}

/**
 * uni-loading
 */
let needLoadingRequestCount = 0;
let loadingTimer: any = null;

export function showLoading(title = '', mask = true) {
    if (needLoadingRequestCount === 0) {
        uni.showLoading({
            title,
            mask,
        });

        // 最长10s自动关闭
        loadingTimer = setTimeout(() => {
            if (needLoadingRequestCount > 0) {
                uni.hideLoading();
            }
        }, 15000);
    }

    needLoadingRequestCount++;
}

export function hideLoading() {
    if (needLoadingRequestCount <= 0) {
        return;
    }

    needLoadingRequestCount--;

    if (needLoadingRequestCount === 0) {
        loadingTimer && clearTimeout(loadingTimer);
        uni.hideLoading();
    }
}
