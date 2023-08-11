import type { Schema } from '@/components/form/interface';
import MenuListAPI from '@/api/menu-list';
import RequestAPI from '@/api/demo/index';

/**
 * 表单配置项
 */
export const schemas: Schema[] = [
    {
        type: 'BaseDivider',
        prop: '',
        label: 'BaseDivider',
    },
    {
        type: 'BaseTitle',
        prop: '',
        label: 'BaseTitle',
    },
    {
        type: 'ScanInput',
        prop: 'cylinderCode',
        label: '扫码框',
        api: RequestAPI.cylinderInfoScan,
        scanCodeMode: 'commonScanCodeAndClear',
        defaultFocus: true,
        attributes: {
            clearable: true,
        },
        rules: [{ required: true, message: '扫码框不能为空' }],
        componentProps: ({ value, form, schemas, schema, result }) => {
            if (result === 'success') {
                console.log('value', value);
                console.log('form', form);
                console.log('schemas', schemas);
                console.log('schema', schema);
                console.log('result', result);
            }
        },
    },
    {
        type: 'BaseInput',
        prop: 'BaseInput',
        label: '基础输入框',
        attributes: {
            placeholder: '自动生成',
        },
        rules: [{ required: true, message: '基础输入框不能为空' }],
    },
    {
        type: 'BaseRadio',
        prop: 'BaseRadio',
        label: '单选框',
        options: [
            { label: '男', value: 1 },
            { label: '女', value: 2 },
        ],
        attributes: {
            placeholder: '自动生成',
        },
        rules: [{ required: true, message: '单选框不能为空' }],
    },
    {
        type: 'InputNumber',
        prop: 'InputNumber',
        label: '数字输入框',
        attributes: {
            min: 1,
            max: 100,
            precision: 5,
            keepPrecision: true,
            placeholder: '自动生成',
        },
        rules: [{ required: true, message: '数字输入框不能为空' }],
    },
    {
        type: 'BaseTextarea',
        prop: 'BaseTextarea',
        label: '文本输入框',
        attributes: {
            placeholder: '自动生成',
        },
        rules: [{ required: true, message: '文本输入框不能为空' }],
    },
    {
        type: 'BaseSelect',
        prop: 'BaseSelect1',
        label: '单选下拉框1',
        labelField: 'BaseSelect1Label',
        options: [
            { label: '跑步', value: 1 },
            { label: '足球', value: 2 },
            { label: '篮球', value: 2 },
            { label: '羽毛球', value: 2 },
            { label: '乒乓球', value: 2 },
        ],
        attributes: {
            placeholder: '自动生成',
        },
        rules: [{ required: true, message: '静态单选下拉框不能为空' }],
    },
    {
        type: 'BaseSelect',
        prop: 'BaseSelect2',
        label: '单选下拉框',
        labelField: 'BaseSelect2Label',
        api: MenuListAPI.getUserName,
        attributes: {
            placeholder: '自动生成',
            clearable: true,
        },
        rules: [{ required: true, message: '动态单选下拉框不能为空' }],
    },
    {
        type: 'SearchSelect',
        prop: 'SearchSelect1',
        label: '多选下拉框1',
        labelField: 'SearchSelect1Label',
        options: [
            { label: '语文', value: 1 },
            { label: '数学', value: 2 },
            { label: '英语', value: 3 },
            { label: '政治', value: 4 },
            { label: '历史', value: 5 },
            { label: '地理', value: 6 },
            { label: '生物', value: 7 },
            { label: '物理', value: 8 },
            { label: '化学', value: 9 },
        ],
        attributes: {
            placeholder: '自动生成',
            multiple: true,
        },
        rules: [{ required: true, message: '静态多选下拉框不能为空' }],
    },
    {
        type: 'SearchSelect',
        prop: 'SearchSelect2',
        label: '多选下拉框2',
        labelField: 'SearchSelect2Label',
        api: MenuListAPI.getUserName,
        attributes: {
            placeholder: '自动生成',
            multiple: true,
            clearable: true,
        },
        rules: [{ required: true, message: '动态多选下拉框不能为空' }],
    },
    {
        type: 'DatePicker',
        prop: 'DatePicker1',
        label: '日期选择框1',
        attributes: {
            placeholder: '自动生成',
            dateType: 'date',
        },
        rules: [{ required: true, message: '日期选择框不能为空' }],
    },
    {
        type: 'DatePicker',
        prop: 'DatePicker2',
        label: '日期选择框2',
        attributes: {
            placeholder: '自动生成',
            dateType: 'datetime',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            clearable: true,
        },
        rules: [{ required: true, message: '日期选择框不能为空' }],
    },
    {
        type: 'BaseUpload',
        prop: 'BaseUpload1',
        label: '图片',
        rules: [{ required: true, message: '图片不能为空' }],
    },
    {
        type: 'FormSlot',
        prop: 'BaseUpload2',
        label: '视频',
        rules: [{ required: true, message: '视频不能为空' }],
    },
];
