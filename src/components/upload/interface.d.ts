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
    /** 是否展示内部预览图 */
    previewImage?: boolean;
    /** 内部预览图宽度 */
    width?: string | number;
    /** 内部预览图高度 */
    height?: string | number;
    /** 是否可删除 */
    deletable?: boolean;
    /** 接收文件的类型 */
    accept?: 'all' | 'media' | 'image' | 'file' | 'video';
    /** 图片或视频拾取模式 */
    capture?: ['album'] | ['camera'] | ['album', 'camera'];
}
