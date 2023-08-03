/**
 * Props
 */
export interface Props {
    /** 双向绑定是否展示 */
    modelValue: boolean;
    /** 标题 */
    title?: string;
    /** 内容 */
    content?: string;
    /** 弹窗宽度 */
    width?: string | number;
    /** 是否开启缩放模式 */
    zoom?: boolean;
    /** 是否异步关闭 */
    asyncClose?: boolean;
    /** 是否点击遮罩层关闭 */
    closeOnClickOverlay?: boolean;
    /** 是否展示确认按钮 */
    showConfirmButton?: boolean;
    /** 是否展示取消按钮 */
    showCancelButton?: boolean;
    /** 确认按钮文字 */
    confirmText?: string;
    /** 取消按钮文字 */
    cancelText?: string;
}
