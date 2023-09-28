import { ref, onBeforeMount } from 'vue';
import type { Props } from './interface';
import { UPLOAD_URL } from '@/constant/global';

export default function useIndex(props: Props, emit: any) {
    /**
     * 图片路径列表
     */
    const fileList = ref<any[]>([]);

    /**
     * 图片路径
     */
    const uploadValue = ref<string>('');

    /**
     * 是否展示遮罩层
     */
    const showOverlay = ref<boolean>(false);

    /**
     * 当前点击视频路径
     */
    const videoUrl = ref<string>('');

    /**
     * @description 读取图片后的处理函数
     * @param e index，name，file
     */
    async function handleAfterRead(e: { file: any; name: string; index: number }) {
        const list: any = [].concat(e.file);
        let length = fileList.value.length;

        list.map((item: any) => {
            fileList.value.push({
                ...item,
                status: 'uploading',
                message: '上传中',
            });
        });

        for (let i = 0; i < list.length; i++) {
            const res = await handleUpload(list[i].url);
            const item = fileList.value[length];

            fileList.value.splice(
                length,
                1,
                Object.assign(item, {
                    status: 'success',
                    message: '',
                    url: res,
                }),
            );

            length++;
        }

        uploadValue.value = fileList.value.map((item: any) => item.url).join(',');
        emit('update:modelValue', uploadValue.value);
    }

    /**
     * @description 上传函数
     * @param url 上传地址
     * @return 返回的参数
     */
    async function handleUpload(url: string) {
        return new Promise(resolve => {
            uni.uploadFile({
                url: UPLOAD_URL,
                filePath: url,
                name: 'file',
                success: res => {
                    resolve(JSON.parse(res.data).data);
                },
                fail: error => {
                    console.log(error);
                    resolve(false);
                },
            });
        });
    }

    /**
     * @description 删除图片回调
     * @param e 当前项的 index，name，file
     */
    function handleDelete(e: any) {
        fileList.value.splice(e.index, 1);
        uploadValue.value = fileList.value.map((item: any) => item.url).join(',');
        emit('update:modelValue', uploadValue.value);
    }

    /**
     * 图片预览
     */
    function handleImagePreview(url: string) {
        uni.previewImage({
            urls: [url],
            current: 0,
        });
    }

    /**
     * 视频预览
     */
    function handleVideoPreview(url: string) {
        videoUrl.value = url;
        showOverlay.value = true;
    }

    /**
     * 删除图片/视频
     */
    function handleItemDelete(index: number) {
        uni.showModal({
            title: '',
            content: '是否确认删除？',
            success: res => {
                if (res.confirm) {
                    fileList.value.splice(index, 1);
                    uploadValue.value = fileList.value.map((item: any) => item.url).join(',');
                    emit('update:modelValue', uploadValue.value);
                }
            },
        });
    }

    /**
     * @description 用于处理表单赋值或者是默认值，将其转化为可渲染的数据
     * @param params 图片地址
     */
    function handleInit(params: any) {
        if (Array.isArray(params)) {
            fileList.value = params.map((item: { sourceFilePath: string; sourceFileName: string }) => {
                return {
                    name: item.sourceFileName,
                    url: item.sourceFilePath,
                };
            });

            uploadValue.value = fileList.value.map((item: any) => item.url).toString();
            emit('update:modelValue', uploadValue.value);
        } else if (params && typeof params === 'string') {
            fileList.value = params.split(',').map((item: string) => {
                return {
                    name: item.split('_')[item.split('_').length - 1],
                    url: item,
                };
            });

            uploadValue.value = fileList.value.map((item: any) => item.url).toString();
            emit('update:modelValue', uploadValue.value);
        } else {
            fileList.value = [];
            uploadValue.value = '';
        }
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(() => {
        if (props.modelValue) {
            handleInit(props.modelValue);
        }
    });

    return {
        fileList,
        showOverlay,
        videoUrl,
        handleAfterRead,
        handleDelete,
        handleImagePreview,
        handleVideoPreview,
        handleItemDelete,
    };
}
