/**
 * x-description 表头配置格式
 */
export interface XDescriptionColumn {
    /** 字段名 */
    prop: string;
    /** 展示文字 */
    label: string;
    /** 单元格渲染类型 */
    renderType?: 'tag' | 'image';
    /** 渲染标签/文本格式化的数据处理函数 */
    formatter?: (row: Record<string, any>, column: XDescriptionColumn) => any;
}

/**
 * x-description 请求接口出参入参字段
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
 * x-description props
 * Partial<XDescriptionProp>
 */
export interface XDescriptionProp {
    size?: number;
    /** 请求接口 */
    api?: any;
    /** 请求接口参数 */
    apiParams?: Record<string, string | number>;
    /** 请求接口字段映射 */
    apiKeyMap?: APIKeyMap;
    /** 是否为分页格式 */
    dividePage?: boolean;
    /** 分页设置 */
    paginationProp?: Record<string, number>;
    /** 配置列表 */
    columns: XDescriptionColumn[];
    /** 静态数据 */
    data?: Record<string, any>[];
}

/**
 * x-description 分页参数
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
 * x-description 切换页码方法默认参数
 */
export interface PaginationChangeParams {
    /** 操作类型 */
    type: string;
    /** 当前页 */
    current: number;
}
