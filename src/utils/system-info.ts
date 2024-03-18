import { onBeforeUnmount, onMounted, ref } from 'vue';

/**
 * width-key
 */
export const SYSTEM_WIDTH_KEY = `${import.meta.env.VITE_APP_NAME}_WIDTH`;

/**
 * 更新设备宽度
 */
export async function updateSystemWidth(): Promise<void> {
    const systemInfo = await uni.getSystemInfo();

    uni.setStorageSync(SYSTEM_WIDTH_KEY, systemInfo.windowWidth ?? '');
}

/**
 * 获取设备宽度
 */
export function getSystemWidth(): number | undefined {
    const width = uni.getStorageSync(SYSTEM_WIDTH_KEY);

    if (!width) {
        return undefined;
    }

    return Number(width);
}

/**
 * col span
 */
export function getColSpan(width?: number): number {
    if (!width || width < 770) {
        return 12;
    }

    if (width < 960) {
        return 8;
    }

    return 6;
}

/**
 * dropdown col
 */
export function getDropdownColSpan(width?: number): number {
    if (!width || width < 770) {
        return 24;
    }

    if (width < 960) {
        return 12;
    }

    return 12;
}

/**
 * dropdown menu col
 */
export function useDropdownMenuCol() {
    onMounted(() => {
        uni.onWindowResize(res => {
            col.value = getDropdownColSpan(res.size.windowWidth);
        });
    });

    onBeforeUnmount(() => {
        uni.offWindowResize(() => {
            console.log('取消监听');
        });
    });

    const col = ref<number>(12);

    return {
        col,
    };
}
