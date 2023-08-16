import { createSSRApp } from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';
import { components } from '@/components/register';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    // 全局注册组件
    components.map(item => {
        app.component(item.name, item.value);
    });

    return {
        app,
    };
}

uni.$u.config.unit = 'rpx';
