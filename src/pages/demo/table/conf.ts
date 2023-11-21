import { XTableColumn } from '@/components/x-table/interface';

/**
 * 状态枚举
 */
enum STATUS_TEXT {
    '成功' = 1,
    '失败' = 2,
}
enum STATUS_TYPE {
    'success' = 1,
    'error' = 2,
}

/**
 * 表格列配置
 */
export const columnList: XTableColumn[] = [
    {
        prop: 'index',
        label: '#',
        width: 50,
    },
    {
        prop: 'addTime',
        label: '登录时间',
        width: 200,
    },
    {
        prop: 'terminalName',
        label: '终端',
    },
    {
        prop: 'account',
        label: '账号',
    },
    {
        prop: 'userName',
        label: '登录人',
    },
    {
        prop: 'deptNames',
        label: '部门',
        width: 200,
    },
    {
        prop: 'status',
        label: '状态',
        renderType: 'tag',
        formatter: (row: Record<string, any>, column: XTableColumn, cellValue: any) => {
            return {
                text: STATUS_TEXT[cellValue] ?? '',
                type: STATUS_TYPE[cellValue] ?? '',
            };
        },
    },
    {
        prop: 'ip',
        label: 'IP',
        width: 200,
    },
    {
        prop: 'address',
        label: '地址',
        formatter: (row: Record<string, any>, column: XTableColumn, cellValue: any) => {
            return cellValue ?? '/';
        },
    },
    {
        prop: 'image',
        label: '图片',
        renderType: 'image',
        formatter: (row: Record<string, any>, column: XTableColumn, cellValue: any) => {
            return [
                'http://192.168.3.38:9000/lvling/1691377252283mhgg.jpg',
                'http://192.168.3.38:9000/lvling/1691377252283mhgg.jpg',
            ];
        },
    },
    {
        prop: 'action',
        label: '操作',
    },
];
