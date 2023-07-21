/**
 * httpType
 */
export type HttpType = 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT' | undefined;

/**
 * http 请求后返回的数据类型
 */
export interface RequestObj {
    code: number;
    data: Record<string, any> | Record<string, any>[];
    message: string;
}
