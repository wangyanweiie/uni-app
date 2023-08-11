/**
 * upload props
 */
export interface Props {
    /** 双向绑定的值 */
    modelValue: string;
    /** 是否可多选 */
    multiple?: boolean;
    /** 最大上传数量 */
    maxCount?: number;
    /** 是否展示缩略图 */
    previewImage?: boolean;
    /** 是否展示内部预览图 */
    previewFullImage?: boolean;
    /** 内部预览图宽度 */
    width?: string | number;
    /** 内部预览图高度 */
    height?: string | number;
    /** 是否可删除 */
    deletable?: boolean;
    /** 是否禁用上传，只预览 */
    disabled?: boolean;
    /** 接收文件的类型，只有微信小程序支持 'media' | 'all'，H5页面支持 'file' */
    // accept: 'all' | 'media' | 'file' | 'image' | 'video';
    accept?: 'image' | 'video';
    /** 图片或视频拾取模式 */
    capture?: ['album'] | ['camera'] | ['album', 'camera'];
}
