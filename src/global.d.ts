import XForm from '@/components/x-form/index.vue';
import XTable from '@/components/x-table/index.vue';
import XDatePicker from '@/components/x-date-picker/index.vue';
import XUpload from '@/components/x-upload/index.vue';
import XSelect from '@/components/x-select/index.vue';
import XSearchSelect from '@/components/x-search-select/index.vue';
import XModal from '@/components/x-modal/index.vue';
import XPrintModal from '@/components/x-print-modal/index.vue';

declare module 'vue' {
    export interface GlobalComponents {
        XForm: typeof XForm;
        XTable: typeof XTable;
        XDatePicker: typeof XDatePicker;
        XUpload: typeof XUpload;
        XSelect: typeof XSelect;
        XSearchSelect: typeof XSearchSelect;
        XModal: typeof XModal;
        XPrintModal: typeof XPrintModal;
    }
}

export {};
