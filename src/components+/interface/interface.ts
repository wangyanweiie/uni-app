import type { CSSProperties } from 'vue';
import type { Numeric } from 'src/constant/base';

export type RuleTrigger = 'change' | 'blur';

/**
 * rule
 */
export interface FormRule {
    pattern?: RegExp;
    trigger?: RuleTrigger | RuleTrigger[];
    message?: string;
    required?: boolean;
    validator?: (rule: any, value: any) => boolean;
}

/**
 * 单选下拉选项
 */
export interface PickerOption {
    label: string;
    value: Numeric;
    disabled?: boolean;
}

/**
 * u-upload file
 */
export interface UploadFileOption {
    size?: string;
    name?: string;
    url: string;
    type?: string;
    thumb?: string;
    status?: 'uploading' | 'failed' | 'success';
    message?: string;
}

/**
 * u-upload params
 */
export interface UploadCallbackParams {
    file: UploadFileOption | UploadFileOption[];
    name: string;
    index: number;
}

/**
 * x-scan-select
 */
export interface XScanSelectInstance {
    clear: () => void;
    resetFocus: () => void;
}

/**
 * scan-ref
 */
export interface XScanInstance {
    resetFocus: () => void;
}

/**
 * form-ref
 */
export interface FormInstance {
    validate: () => Promise<boolean>;
    setRules: (rules: any) => void;
    clearValidate: () => void;
}

/**
 * list ref
 */
export interface XListInstance {
    load: (data: any) => Promise<void>;
    refresh: () => Promise<void>;
}

/**
 * component type
 */
export type componentType =
    | 'XInput'
    | 'XRadio'
    | 'XDateTimePicker'
    | 'XTimePicker'
    | 'XSelect'
    | 'XUpload'
    | 'TextArea'
    | 'Upload'
    | 'Input'
    | 'Title';

/**
 * 单选按钮组 /下拉选择器 type
 */
export type OptionsItem = {
    label: string;
    value: string | number | boolean;
};

export type selectFormProp = {
    [key: string]: {
        options?: OptionsItem[];
    };
};

export type formSchema = {
    label: string;
    prop: string;
    component: componentType;
    componentProps?: any;
    hidden?: boolean;
    defaultValue?: any;

    eventCollection?: (
        value: boolean | string | number | any,
        selectForm: selectFormProp,
        form: Recordable,
        schema: formSchema,
    ) => any;
    required?: boolean;
    dynamicDisabled?: boolean | ((form: Recordable) => boolean);
    dynamicHidden?: boolean | ((form: Recordable) => boolean);
};

export interface formRefProp extends HTMLElement {
    validate: () => Promise<boolean>;
    resetFields: () => void;
}

/**
 * cascader-tab
 */
export interface XCascaderTab {
    /** 显示名称 */
    name?: Numeric;
    /** 选中下标 */
    selectedValue?: Numeric;
}

/**
 * X Cascader option
 */
export interface XCascaderOption {
    label?: Numeric;
    value?: Numeric;
    children?: XCascaderOption[];
}

/**
 * popup ref
 */
export interface PopupInstance {
    open: () => void;
    close: () => void;
}

/**
 * record
 */
export type Recordable = Record<string, any>;

/**
 * SWIPE OPTIONS
 */
export interface SwipeOption {
    text: string;
    style: CSSProperties;
}
