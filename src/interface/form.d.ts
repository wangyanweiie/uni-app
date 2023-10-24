/**
 * form-ref
 */
export interface FormInstance {
    /** 校验 */
    validate: () => Promise<boolean>;
    /** 设置校验规则 */
    setRules: (rules: Record<string, FormRule[]>) => void;
    /** 清空校验 */
    clearValidate: () => void;
}

type RuleTrigger = 'change' | 'blur';

/**
 * form-rules
 */
export interface FormRule {
    /** 必填标识 */
    required: boolean;
    /** 必填提示 */
    message: string;
    /** 触发方式 */
    trigger?: RuleTrigger | RuleTrigger[];
    /** 最小值 */
    min?: number;
    /** 最大值 */
    max?: number;
    /** 长度 */
    len?: number;
    /** 要求此参数值为一个正则表达式，组件会对字段进行正则判断，返回结果 */
    pattern?: RegExp;
    /** 自定义校验规则 */
    validator?: (rule: any, value: any) => boolean;
}
