import type { Schema } from '@/components/x-form/interface';
import RequestAPI from '@/api/menu-list';

/**
 * 表单配置项
 */
export const schemas: Schema[] = [
    {
        type: 'BaseTitle',
        prop: '',
        label: 'BaseTitle',
    },
    {
        type: 'BaseDivider',
        prop: '',
        label: 'BaseDivider',
    },
    {
        type: 'ScanInput',
        prop: 'ScanInput',
        label: '扫码框',
        scanCodeMode: 'commonScanCodeAndClear',
        defaultFocus: true,
        attributes: {
            placeholder: 'ScanInput',
            clearable: true,
        },
        rules: [{ required: true, message: '扫码框不能为空' }],
    },
    {
        type: 'BaseInput',
        prop: 'BaseInput',
        label: '基础输入框',
        attributes: {
            placeholder: 'BaseInput',
            clearable: true,
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
            placeholder: 'BaseRadio',
            clearable: true,
        },
        rules: [{ required: true, message: '单选框不能为空' }],
    },
    {
        type: 'InputNumber',
        prop: 'InputNumber',
        label: '数字输入框',
        attributes: {
            min: 1,
            max: 120,
            precision: 5,
            keepPrecision: true,
            placeholder: 'InputNumber',
            clearable: true,
        },
        rules: [{ required: true, message: '数字输入框不能为空' }],
    },
    {
        type: 'BaseSelect',
        prop: 'BaseSelect1',
        label: '单选下拉框',
        options: [
            { label: '跑步', value: 1 },
            { label: '足球', value: 2 },
            { label: '篮球', value: 2 },
            { label: '羽毛球', value: 2 },
            { label: '乒乓球', value: 2 },
        ],
        attributes: {
            placeholder: 'BaseSelect',
            clearable: true,
        },
        rules: [{ required: true, message: '静态单选下拉框不能为空' }],
    },
    {
        type: 'BaseSelect',
        prop: 'BaseSelect2',
        label: '单选下拉框',
        api: RequestAPI.getUserName,
        attributes: {
            placeholder: 'BaseSelect',
            clearable: true,
        },
        rules: [{ required: true, message: '动态单选下拉框不能为空' }],
    },
    {
        type: 'SearchSelect',
        prop: 'SearchSelect1',
        label: '多选下拉框',
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
            multiple: true,
            placeholder: 'SearchSelect',
            clearable: true,
        },
        rules: [{ required: true, message: '静态多选下拉框不能为空' }],
    },
    {
        type: 'SearchSelect',
        prop: 'SearchSelect2',
        label: '多选下拉框',
        api: RequestAPI.getUserName,
        attributes: {
            multiple: true,
            placeholder: 'SearchSelect',
            clearable: true,
        },
        rules: [{ required: true, message: '动态多选下拉框不能为空' }],
    },
    {
        type: 'DatePicker',
        prop: 'DatePicker1',
        label: '日期选择框',
        attributes: {
            dateType: 'date',
            placeholder: 'DatePicker',
            clearable: true,
        },
        rules: [{ required: true, message: '日期选择框不能为空' }],
    },
    {
        type: 'DatePicker',
        prop: 'DatePicker2',
        label: '日期选择框',
        attributes: {
            dateType: 'datetime',
            dateFormat: 'YYYY-MM-DD HH:mm:ss',
            placeholder: 'DatePicker',
            clearable: true,
        },
        rules: [{ required: true, message: '日期选择框不能为空' }],
    },
    {
        type: 'BaseTextarea',
        prop: 'BaseTextarea',
        label: '文本输入框',
        attributes: {
            placeholder: 'BaseTextarea',
            clearable: true,
        },
        rules: [{ required: true, message: '文本输入框不能为空' }],
    },
    {
        type: 'BaseUpload',
        prop: 'BaseUpload',
        label: '上传',
        fileList: [],
        attributes: {
            placeholder: 'BaseUpload',
            clearable: true,
        },
        rules: [{ required: true, message: '上传不能为空' }],
    },
];
