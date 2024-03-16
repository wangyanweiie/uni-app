interface ActionSheet {
    tapIndex: number;
}

interface TempFile {
    /** 本地文件路径 */
    path: string;
    /** 本地文件大小，单位：B */
    size: number;
}

interface ChooseFile {
    /** 图片的本地文件路径列表 */
    tempFilePaths: string | string[];
    /** 图片的本地文件列表，每一项是一个 File 对象 */
    tempFiles: TempFile | TempFile[] | File | File[] | any | any[];
}

interface ChooseVideo {
    /** 选定视频的临时文件路径 */
    tempFilePath: string;
    /** 选定的视频文件 */
    tempFile: File;
    /** 选定视频的时间长度 */
    duration: number;
    /** 选定视频的数据量大小 */
    size: number;
    /** 返回选定视频的长 */
    height: number;
    /** 返回选定视频的宽 */
    width: number;
    /** 包含扩展名的文件名称（仅H5支持） */
    name: string;
}

/**
 * 选择文件类型
 * @returns 图片 | 视频
 */
export function chooseFileType(): Promise<ActionSheet | false> {
    return new Promise(resolve => {
        uni.showActionSheet({
            itemList: ['图片', '视频'],
            success: async (res: ActionSheet) => {
                resolve(res);
            },
            fail: () => {
                resolve(false);
            },
        });
    });
}

/**
 * 选择图片
 * @returns 图片
 */
export function chooseImage(): Promise<ChooseFile | false> {
    return new Promise(resolve => {
        uni.chooseImage({
            success: res => {
                resolve(res);
            },
            fail: () => {
                resolve(false);
            },
        });
    });
}

/**
 * 选择视频
 * @returns 视频
 */
export function chooseVideo(): Promise<ChooseVideo | false> {
    return new Promise(resolve => {
        uni.chooseVideo({
            compressed: false,
            success: res => {
                resolve(res);
            },
            fail: () => {
                resolve(false);
            },
        });
    });
}
