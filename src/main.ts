import { createSSRApp } from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';

// 全局注册自定义组件
import XForm from '@/components/x-form/index.vue';
import XTable from '@/components/x-table/index.vue';
import XSelect from '@/components/select/index.vue';
import XSearchSelect from '@/components/search-select/index.vue';

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    app.component('XForm', XForm);
    app.component('XTable', XTable);
    app.component('XSelect', XSelect);
    app.component('XSearchSelect', XSearchSelect);

    return {
        app,
    };
}
