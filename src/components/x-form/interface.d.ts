/**
 * schema 校验规则类型
 */
export interface Rules {
    /** 必填标识 */
    required: boolean;
    /** 必填提示 */
    message: string;
}

/**
 * schema 下拉列表数据类型
 */
export interface Options {
    label: string;
    value: string | number;
}

/**
 * schema 其他属性类型
 */
export interface Attributes {
    // ============ 所有组件共用属性 ============
    /** 提示文字 */
    placeholder: string;
    /** 是否禁用 */
    disabled: boolean;
    /** 是否可清空 */
    clearable: boolean;
    /** 是否渲染边框 */
    border: 'surround' | 'bottom' | 'none';

    // ============ BaseInput | ScanInput | InputNumber | SearchSelect | DatePicker ============
    /** 是否只读 */
    readonly: boolean;

    // ============ InputNumber ============
    /** 最小值 */
    min: number;
    /** 最大值 */
    max: number;
    /** 精度 */
    precision: number;
    /** 是否强制保留精度  */
    keepPrecision: boolean;

    // ============ DatePicker ============
    /** 日期类型 */
    dateType: 'time' | 'date' | 'datetime';
    /** 日期组件处理格式 */
    dateFormat: 'YYYY-MM-DD HH' | 'YYYY-MM-DD HH:mm' | 'YYYY-MM-DD HH:mm:ss';

    // ============ SearchSelect | BaseUpload ============
    /** 是否多选 */
    multiple: boolean;

    // ============ BaseDivider ============
    /** 是否虚线 */
    dashed: boolean;
    /** 是否细线 */
    hairline: boolean;
    /** 文本大小 */
    textSize: string | number;
    /** 文本颜色 */
    textColor: string;
    /** 内容文本的位置 */
    textPosition: 'center' | 'left' | 'right';
    /** 线条颜色 */
    lineColor: string;

    // ============ BaseUpload ============
    /** 最大上传数量 */
    maxCount: number;
    /** 是否展示缩略图 */
    previewImage: boolean;
    /** 是否展示内部预览图 */
    previewFullImage: boolean;
    /** 内部预览图宽度 */
    width: string | number;
    /** 内部预览图高度 */
    height: string | number;
    /** 是否可删除 */
    deletable: boolean;
    /** 接收文件的类型，只有微信小程序支持 'media' | 'all'，H5页面支持 'file' */
    // accept: 'all' | 'media' | 'file' | 'image' | 'video';
    accept: 'image' | 'video';
    /** 图片或视频拾取模式 */
    capture: ['album'] | ['camera'] | ['album', 'camera'];

    [key: string]: any;
}

/**
 * schema 插槽类型
 */
export interface InputSlots {
    /** 渲染样式 */
    renderType: 'text' | 'tag';
    /** 渲染内容 */
    content: string;
    /** 其他属性 */
    attribute?: Record<string, any>;
    /** function */
    Function?: () => void;
}

/**
 * schema 联动方法参数类型
 */
export interface ComponentPropsParams {
    value: any;
    form: Record<string, any>;
    schemas: Schema[];
    schema: Schema;
    result: 'success' | 'error' | 'clear' | 'change';
}

/**
 * schema
 */
export interface Schema {
    /** 组件类型 */
    type:
        | 'Slot'
        | 'FormSlot'
        | 'BaseDivider'
        | 'BaseTitle'
        | 'BaseInput'
        | 'InputNumber'
        | 'BaseTextarea'
        | 'BaseRadio'
        | 'BaseDatePicker'
        | 'BaseUpload'
        | 'BaseSelect'
        | 'SearchSelect'
        | 'ScanInput';

    /** 字段名 */
    prop: string;
    /** 字段文字 */
    label: string;
    /** 占位空间 */
    span?: number;
    /** 默认值 */
    defaultValue?: any;
    /** 是否展示*/
    hidden?: boolean;
    /** 表单校验 */
    rules?: Rules[];
    /** 查询接口 */
    api?: (params: Record<string, any>) => Promise<any>;
    /** 查询接口入参 */
    apiParams?: Record<string, any>;
    /** 静态下拉列表 */
    options?: Options[];
    /** 用于保存下拉 label 字段 */
    labelField?: string;
    /** 图片列表 */
    fileList?: Record<string, any>[];
    /** 其他属性 */
    attributes?: Partial<Attributes>;

    /**
     * 扫码模式
     * commonScanCode 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后不重置表单
     * commonScanCodeAndClear 普通扫码模式：扫码成功后返回结果、不重置条码；扫码失败后重置表单
     * continuousScanCode 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后不重置表单、并且重新聚焦
     * continuousScanCodeAndClear 连续扫码模式：扫码成功后返回结果、并重置条码；扫码失败后重置表单、并且重新聚焦
     * onlyResetCode 扫码成功后返回结果、不重置条码；扫码失败只清空条码、并且重新聚焦
     */
    scanCodeMode?:
        | 'commonScanCode'
        | 'commonScanCodeAndClear'
        | 'continuousScanCode'
        | 'continuousScanCodeAndClear'
        | 'onlyResetCode';
    /** 是否默认聚焦 */
    defaultFocus?: boolean;
    /** 插槽 */
    inputSlots?: InputSlots;
    /** 联动函数 */
    componentProps?: (params: ComponentPropsParams) => Promise<void> | void;
}

/**
 * x-form Props
 */
export interface XFormProps {
    schemaList: Schema[];
    labelWidth?: string | number;
}

/**
 * handleEmit 方法参数
 */
export interface EmitEvent {
    value: string | number;
    schema: Schema;
    isClear: boolean;
}

/**
 * handleSelect 方法参数
 */
export interface SelectEvent {
    value: Options;
    schema: Schema;
    isClear: boolean;
}

/**
 * handleScanSuccess 方法参数
 */
export interface ScanSuccessEvent {
    value: string;
    result: object;
    schema: Schema;
    reset: boolean;
}

/**
 * handleScanFail 方法参数
 */
export interface ScanFailEvent {
    value: string;
    schema: Schema;
    reset: boolean;
    resetParams?: Record<string, any>;
}
