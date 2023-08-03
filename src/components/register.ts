import Form from '@/components/form/index.vue';
import Table from '@/components/table/index.vue';
import Select from '@/components/select/index.vue';
import SearchSelect from '@/components/search-select/index.vue';
import DatePicker from '@/components/date-picker/index.vue';
import PrintModal from '@/components/print-modal/index.vue';
import Modal from '@/components/modal/index.vue';

export const components = [
    { name: 'XForm', value: Form },
    { name: 'XTable', value: Table },
    { name: 'XSelect', value: Select },
    { name: 'XSearchSelect', value: SearchSelect },
    { name: 'XDatePicker', value: DatePicker },
    { name: 'XPrintModal', value: PrintModal },
    { name: 'XModal', value: Modal },
];
