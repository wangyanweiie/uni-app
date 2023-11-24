import { ref, onBeforeMount, computed } from 'vue';
import type { Props, File, Event } from './interface';

export default function useIndex(props: Props, emit: any) {
    /**
     * 图片信息列表
     */
    const fileList = ref<File[]>([]);

    /**
     * 图片路径列表
     */
    const uploadValue = computed<string[]>({
        get: () => [],
        set: newValue => emit('update:modelValue', newValue),
    });

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
    async function handleAfterRead(e: Event) {
        const list: File[] = ([] as File[]).concat(e.file);
        let length = fileList.value.length;

        list.map((item: File) => {
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

        uploadValue.value = fileList.value.length ? fileList.value.map((item: File) => item.url) : [];
    }

    /**
     * @description 上传函数
     * @param url 上传地址
     * @return 返回的参数
     */
    async function handleUpload(url: string) {
        return new Promise(resolve => {
            uni.uploadFile({
                url: props.uploadUrl as string,
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
        showOverlay.value = true;
        videoUrl.value = url;
    }

    /**
     * @description 删除图片回调
     * @param e 当前项的 index，name，file
     */
    function handleDelete(e: Event) {
        fileList.value.splice(e.index, 1);
        uploadValue.value = fileList.value.length ? fileList.value.map((item: File) => item.url) : [];
    }

    /**
     * 删除图片/视频
     */
    function handleItemDelete(index: number) {
        uni.showModal({
            content: '是否确认删除？',
            success: res => {
                if (res.confirm) {
                    fileList.value.splice(index, 1);
                    uploadValue.value = fileList.value.length ? fileList.value.map((item: File) => item.url) : [];
                }
            },
        });
    }

    /**
     * 关闭遮罩层
     */
    function handleCloseOverlay() {
        showOverlay.value = false;
    }

    /**
     * @description 用于处理表单赋值或者是默认值，将其转化为可渲染的数据
     * @param params 图片地址
     */
    function handleInit(params: string[]) {
        if (Array.isArray(params) && params.length > 0) {
            fileList.value = params.map((url: string) => {
                return {
                    name: url.split('/')[url.split('/').length - 1],
                    url: url,
                };
            });
        } else {
            fileList.value = [];
        }

        uploadValue.value = fileList.value.length ? fileList.value.map((item: File) => item.url) : [];
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
        handleImagePreview,
        handleVideoPreview,
        handleDelete,
        handleItemDelete,
        handleCloseOverlay,
    };
}
