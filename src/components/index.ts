import { type App, type Component, shallowRef } from 'vue';
import XForm from '@/components/x-form/index.vue';
import XTable from '@/components/x-table/index.vue';
import XDescriptions from '@/components/x-descriptions/index.vue';
import XDatePicker from '@/components/x-date-picker/index.vue';
import XUpload from '@/components/x-upload/index.vue';
import XSelect from '@/components/x-select/index.vue';
import XSearchSelect from '@/components/x-search-select/index.vue';
import XModal from '@/components/x-modal/index.vue';
import XPrintModal from '@/components/x-print-modal/index.vue';
import XSignature from '@/components/x-signature/index.vue';

interface ComponentItem {
    name: string;
    component: Component;
}

const components = shallowRef<ComponentItem[]>([
    { name: 'XForm', component: XForm },
    { name: 'XTable', component: XTable },
    { name: 'XDescriptions', component: XDescriptions },
    { name: 'XDatePicker', component: XDatePicker },
    { name: 'XUpload', component: XUpload },
    { name: 'XSelect', component: XSelect },
    { name: 'XSearchSelect', component: XSearchSelect },
    { name: 'XModal', component: XModal },
    { name: 'XPrintModal', component: XPrintModal },
    { name: 'XSignature', component: XSignature },
]);

/**
 * @description 注册组件
 * @param app vue app
 */
export default {
    install: (app: App) => {
        components.value.forEach(({ name, component }) => {
            app.component(name, component);
        });
    },
};
