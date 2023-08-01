import { createSSRApp } from 'vue';
import App from './App.vue';
import uviewPlus from 'uview-plus';

// 全局注册组件
import XForm from '@/components/x-form/index.vue'; // 表单
import XTable from '@/components/x-table/index.vue'; // 表格
import XSelect from '@/components/select/index.vue'; // 模糊单选
import XSearchSelect from '@/components/search-select/index.vue'; // 模糊多选
import XDatePicker from '@/components/date-picker/index.vue'; // 日期

export function createApp() {
    const app = createSSRApp(App);

    app.use(uviewPlus);

    app.component('XForm', XForm);
    app.component('XTable', XTable);
    app.component('XSelect', XSelect);
    app.component('XSearchSelect', XSearchSelect);
    app.component('XDatePicker', XDatePicker);

    return {
        app,
    };
}
