import { ref } from 'vue';
import { getStorage } from '@/utils/uni-storage';

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
    const authPermission = ref<any[]>(getStorage('userInfo').appPerms || []);

    /**
     * 菜单列表
     */
    const menuList = ref<menuItem[]>(
        [
            {
                label: 'watermark',
                value: 'watermark',
                subMenu: [
                    {
                        label: 'watermark',
                        value: 'sycs',
                        icon: '',
                        path: '/pages/watermark/index',
                    },
                ],
            },
            {
                label: 'demo',
                value: 'demo',
                subMenu: [
                    {
                        label: 'Base',
                        value: 'Base',
                        icon: '',
                        path: '/pages/demo/base/index',
                    },
                    {
                        label: 'Form',
                        value: 'Form',
                        icon: '',
                        path: '/pages/demo/form/index',
                    },
                    {
                        label: 'Table',
                        value: 'Table',
                        icon: '',
                        path: '/pages/demo/table/index',
                    },
                    {
                        label: 'Combine',
                        value: 'Combine',
                        icon: '',
                        path: '/pages/demo/combine-table/index',
                    },
                    {
                        label: 'WebView',
                        value: 'WebView',
                        icon: '',
                        path: '/pages/demo/web-view/index',
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

        //         return authPermission.value.includes(sub.value || menu.value);
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
