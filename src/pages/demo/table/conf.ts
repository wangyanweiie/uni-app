export const columnList = [
    {
        prop: 'index',
        label: '#',
        width: 50,
        // fixedProps: {
        //     direction: 'left',
        // },
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
        type: 'slot',
    },
    {
        prop: 'ip',
        label: 'IP',
        width: 200,
    },
    {
        prop: 'action',
        label: '操作',
        fixedProps: {
            direction: 'right',
        },
    },
];
