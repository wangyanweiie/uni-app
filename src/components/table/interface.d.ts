/**
 * x-table 表头配置格式
 */
export interface HeaderItem {
    /** 表头字段名 */
    prop: string;
    /** 表头展示文字 */
    label: string;
    /** 表格列宽度 */
    width?: number | string;
    /** 居中方式 */
    align?: 'left' | 'center' | 'right';
    /** 表头是否渲染必填标识 */
    required?: boolean;
    /** 固定列样式 */
    fixedProps?: {
        direction: 'left' | 'right';
        distance?: string;
    };
    /** 单元格渲染类型 */
    type?: 'tag' | 'image' | 'slot';
    /** 渲染标签/图片/文本格式化的数据处理函数 */
    expression?: (row: Record<string, any>, header: HeaderItem) => any;
}

/**
 * x-table 请求接口出参入参字段
 * Partial<APIKeyMap>
 */
export interface APIKeyMap {
    /** 查询时的当前页 key 值 */
    queryCurrentPageKey: string;
    /** 查询时的每页数量 key 值 */
    queryPageSizeKey: string;
    /** 返回时当前页 key 值 */
    returnCurrentPageKey: string;
    /** 返回时的总数据量 key 值 */
    returnTotalKey: string;
    /** 返回时总页数 key 值 */
    returnPagesKey: string;
    /** 返回时的数据列表 key 值 */
    returnRecordKey: string;
}

/**
 * x-table props
 * Partial<XTableProp>
 */
export interface XTableProp {
    /** 标题 */
    title: string;
    /** 无数据提示 */
    emptyText: string;
    /** 请求接口 */
    api: any;
    /** 请求接口参数 */
    apiParams: Record<string, string | number>;
    /** 请求接口字段映射 */
    apiKeyMap: Partial<APIKeyMap>;
    /** 是否为分页格式 */
    dividePage: boolean;
    /** 分页设置 */
    paginationProp: Record<string, number>;
    /** 表头列表 */
    tableHeader: HeaderItem[];
    /** 静态表格数据 */
    tableDataProp: Record<string, any>[];
    /** 是否渲染 loading */
    loading: boolean;
    /** 是否可选 */
    selectable: boolean;
    /** 是否渲染斑马纹 */
    stripe: boolean;
    /** 决定行颜色字段 */
    colorField: string;
    /** 可滑动的最小高度 */
    scrollStyle: any;
}

/**
 * x-table 分页参数
 */
export interface Pagination {
    /** 每页数量 */
    pageSize: number;
    /** 当前页 */
    page: number;
    /** 总数据量 */
    total: number;
}

/**
 * x-table 切换页码方法默认参数
 */
export interface PaginationChangeParams {
    /** 操作类型 */
    type: string;
    /** 当前页 */
    current: number;
}

/**
 * x-table 固定列函数返回结果
 * Partial<FixedStyleFunReturn>
 */
export interface FixedStyleFunReturn {
    /** 固定方式 */
    position: string;
    /** 左侧距离 */
    left: string;
    /** 右侧距离 */
    right: string;
    /** 背景颜色 */
    backgroundColor: string;
    /** z-index */
    zIndex: number;
}

/**
 * x-table 必填列校验函数返回结果
 */
export interface ValidateFunReturn {
    /** 行索引 */
    index: number;
    /** 字段名 */
    field: string;
    /** 校验结果 */
    flag: boolean;
}
