import { computed } from 'vue';
import { getStorage } from '@/utils/uni-storage';
import { LOCAL_PERMISSION_KEY } from '@/constant/global';
import i18n from '@/locale';

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

const { t } = i18n.global;

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
    const menuList = computed<menuItem[]>(
        () => [
            {
                label: t('menu.demo'),
                value: 'demo',
                subMenu: [
                    {
                        label: t('menu.base'),
                        value: 'Base',
                        icon: 'iconfont-jichukecheng',
                        path: '/pages/demo/base/index',
                    },
                    {
                        label: t('menu.form'),
                        value: 'Form',
                        icon: 'iconfont-17',
                        path: '/pages/demo/form/index',
                    },
                    {
                        label: t('menu.table'),
                        value: 'Table',
                        icon: 'iconfont-biaoge1',
                        path: '/pages/demo/table/index',
                    },
                    {
                        label: t('menu.description'),
                        value: 'Description',
                        icon: 'iconfont-wenzimiaoshu',
                        path: '/pages/demo/description/index',
                    },
                ],
            },
            {
                label: t('menu.other'),
                value: 'other',
                subMenu: [
                    {
                        label: t('menu.circulateForm'),
                        value: 'Circulate',
                        icon: 'iconfont-24gl-repeat',
                        path: '/pages/other/circulate-form/index',
                    },
                    {
                        label: t('menu.combineTable'),
                        value: 'Combine',
                        icon: 'iconfont-merge',
                        path: '/pages/other/combine-table/index',
                    },
                    {
                        label: t('menu.btPrint'),
                        value: 'Combine',
                        icon: 'iconfont-24gl-printer',
                        path: '/pages/other/print/index',
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
