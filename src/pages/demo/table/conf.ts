import { HeaderItem } from '@/components/table/interface';

/**
 * 状态枚举
 */
enum STATUS {
    '成功' = 1,
    '失败' = 2,
}

export const columnList = [
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
        type: 'tag',
        expression: (data: Record<string, any>, header: HeaderItem) => {
            let type: string;

            if (data[header.prop] === STATUS['成功']) {
                type = 'success';
            } else {
                type = 'error';
            }

            return {
                text: STATUS[data[header.prop]],
                type,
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
        expression: (data: Record<string, any>, header: HeaderItem) => {
            if (data[header.prop]) {
                return data[header.prop];
            } else {
                return '/';
            }
        },
    },
    {
        prop: 'image',
        label: '图片',
        type: 'image',
        expression: (data: Record<string, any>, header: HeaderItem) => {
            return ['http://192.168.3.38:9000/lvling/1691377252283mhgg.jpg'];
        },
    },
    {
        prop: 'action',
        label: '操作',
        fixedProps: {
            direction: 'right',
        },
    },
];
