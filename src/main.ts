import { createSSRApp, defineAsyncComponent } from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';
import registerComponents from '@/components';
// import { handleToHumpFormat } from '@/utils/hooks';
import i18n from '@/i18n/index';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    app.use(i18n);

    // 通过声明组件 name 注册组件
    app.use(registerComponents);

    /**
     * FIXME: 通过 defineAsyncComponent 异步注册指定路径下的组件 => 真机运行/打包报错
     * 动态加载已使用代码拆分，在以下情况会自动进行代码拆分
     *  - 动态加载模块
     *  - 多入口引入统一模块
     *  - 通过输出配置 output.manualChunks 指定需要拆分的模块
     * 但编译类型 UMD、IIFE 是不支持代码拆分的
     */
    // const components = import.meta.glob('./components/*/index.vue');
    // for (const [key, component] of Object.entries(components)) {
    //     const name = key.split('/')[2];
    //     const componentName = handleToHumpFormat(name, 'max');
    //     app.component(componentName, defineAsyncComponent(component as any));
    // }

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

uni.$u.config.unit = 'rpx';
