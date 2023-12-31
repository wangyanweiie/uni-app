import type { Schema } from '../interface';

/**
 * Props
 */
export interface Props {
    /** 表单配置 */
    schema: Schema;
}

/**
 * Request Obj
 */
export interface RequestObj {
    code: number;
    data: Record<string, any> | any[];
    message: string;
}
