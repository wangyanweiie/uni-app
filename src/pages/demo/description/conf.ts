import { XDescriptionColumn } from '@/components/x-descriptions/interface';

/**
 * 状态枚举
 */
export enum STATUS {
    '成功' = 1,
    '失败' = 2,
}

/**
 * 表格列配置
 */
export const columnList: XDescriptionColumn[] = [
    {
        prop: 'addTime',
        label: '登录时间',
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
    },
    {
        prop: 'status',
        label: '状态',
        type: 'tag',
        expression: (row: Record<string, any>, header: XDescriptionColumn) => {
            let type: string;

            if (row[header.prop] === STATUS['成功']) {
                type = 'success';
            } else {
                type = 'error';
            }

            return {
                text: STATUS[row[header.prop]],
                type,
            };
        },
    },
    {
        prop: 'ip',
        label: 'IP',
    },
    {
        prop: 'address',
        label: '地址',
        expression: (row: Record<string, any>, header: XDescriptionColumn) => {
            if (row[header.prop]) {
                return row[header.prop];
            } else {
                return '/';
            }
        },
    },
    {
        prop: 'image',
        label: '图片',
        type: 'image',
        expression: (row: Record<string, any>, header: XDescriptionColumn) => {
            return ['http://192.168.3.38:9000/lvling/1691377252283mhgg.jpg'];
        },
    },
];
