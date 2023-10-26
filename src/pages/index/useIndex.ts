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
    const authPermission = getStorage(LOCAL_PERMISSION_KEY) || [];

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
                        icon: 'iconfont-jichukecheng',
                        path: '/pages/demo/base/index',
                    },
                    {
                        label: 'Form',
                        value: 'Form',
                        icon: 'iconfont-17',
                        path: '/pages/demo/form/index',
                    },
                    {
                        label: 'Table',
                        value: 'Table',
                        icon: 'iconfont-biaoge1',
                        path: '/pages/demo/table/index',
                    },
                    {
                        label: 'Description',
                        value: 'Description',
                        icon: '',
                        path: '/pages/demo/description/index',
                    },
                ],
            },
            {
                label: 'other',
                value: 'other',
                subMenu: [
                    {
                        label: '循环表单',
                        value: 'Circulate',
                        icon: 'iconfont-24gl-repeat',
                        path: '/pages/other/circulate-form/index',
                    },
                    {
                        label: '合并表格',
                        value: 'Combine',
                        icon: 'iconfont-merge',
                        path: '/pages/other/combine-table/index',
                    },
                    {
                        label: '图片水印',
                        value: 'watermark',
                        icon: 'iconfont-a-ziyuan315',
                        path: '/pages/other/watermark/index',
                    },
                    {
                        label: '文件预览',
                        value: 'preview',
                        icon: 'iconfont-a-ziyuan315',
                        path: '/pages/other/preview/index',
                    },
                    {
                        label: 'WebView',
                        value: 'WebView',
                        icon: 'iconfont-Web',
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

        //         return authPermission.value.includes(sub.value || menu.value);
        //     }),
        // }))
        // .filter(menu => menu.subMenu.length > 0),
    );

    /**
     * 跳转页面
     */
    function navigateTo(item: subMenuItem) {
        uni.navigateTo({
            url: item.path,
        });
    }

    return {
        menuList,
        navigateTo,
    };
}
