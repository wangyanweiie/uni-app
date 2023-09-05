import {
    createSSRApp,
    // defineAsyncComponent
} from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';
import { components } from '@/components/register';
// import { handleToHumpFormat } from '@/utils/hooks';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    // 通过声明组件 name 注册组件
    components.map(item => {
        app.component(item.name, item);
    });

    // 通过 defineAsyncComponent 异步注册指定路径下的组件
    // const components = import.meta.glob('./components/*/index.vue');

    // for (const [key, component] of Object.entries(components)) {
    //     const name = key.split('/')[2];
    //     const componentName = handleToHumpFormat(name, 'max');

    //     app.component(componentName, defineAsyncComponent(component as any));
    // }

    return {
        app,
    };
}

uni.$u.config.unit = 'rpx';
