import { createSSRApp } from 'vue';
import uviewPlus from 'uview-plus';
import registerComponents from '@/components';
import i18n from '@/locale';
import App from './App.vue';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    app.use(i18n);

    // 通过声明组件 name 注册组件
    app.use(registerComponents);

    /**
     * 捕获全局未处理的异常
     * @param err 错误文件
     * @param vm vue 实例
     * @param info
     */
    app.config.errorHandler = (err, vm, info) => {
        console.error('err: %o', err);
        console.error('vm: %o', vm);
        console.error('info: %o', info);
    };

    return {
        app,
    };
}
