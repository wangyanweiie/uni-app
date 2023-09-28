import { ref } from 'vue';
import { getStorage } from '@/utils/uni-storage';
import { LOCAL_PERMISSION_KEY } from '@/constant/global';

interface subMenuItem {
    label: string;
    value: string;
    icon: string;
    path: string;
}

interface menuItem {
    label: string;
    value: string;
    subMenu: subMenuItem[];
}

/**
 * useIndex
 */
export default function useIndex() {
    /**
     * 权限数组
     */
    const authPermission = getStorage(LOCAL_PERMISSION_KEY) ?? [];

    /**
     * 菜单列表
     */
    const menuList = ref<menuItem[]>(
        [
            {
                label: 'demo',
                value: 'demo',
                subMenu: [
                    {
                        label: 'Base',
                        value: 'Base',
                        icon: 'more-dot-fill',
                        // icon: 'iconfont-tiaomashuru',
                        path: '/pages/demo/base/index',
                    },
                    {
                        label: 'Form',
                        value: 'Form',
                        icon: 'order',
                        // icon: 'iconfont-gongdan1',
                        path: '/pages/demo/form/index',
                    },
                    {
                        label: 'Table',
                        value: 'Table',
                        icon: 'list',
                        // icon: 'iconfont-lishijilu',
                        path: '/pages/demo/table/index',
                    },
                ],
            },
            {
                label: 'other',
                value: 'other',
                subMenu: [
                    {
                        label: 'watermark',
                        value: 'sycs',
                        icon: 'thumb-up',
                        path: '/pages/other/watermark/index',
                    },
                    {
                        label: 'Combine',
                        value: 'Combine',
                        icon: 'thumb-up',
                        path: '/pages/other/combine-table/index',
                    },
                    {
                        label: 'WebView',
                        value: 'WebView',
                        icon: 'thumb-up',
                        path: '/pages/other/web-view/index',
                    },
                ],
            },
        ],
        // .map(menu => ({
        //     ...menu,
        //     subMenu: menu.subMenu.filter(sub => {
        //         if (Array.isArray(sub.value)) {
        //             return sub.value.some(val => authPermission.value.includes(val));
        //         }

        //         return authPermission.value.includes(sub.value ?? menu.value);
        //     }),
        // }))
        // .filter(menu => menu.subMenu.length > 0),
    );

    /**
     * 跳转页面
     */
    function navigateTo(subMenu: subMenuItem) {
        uni.navigateTo({
            url: subMenu.path,
        });
    }

    return {
        menuList,
        navigateTo,
    };
}
