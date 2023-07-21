import { ref, onBeforeMount } from 'vue';
import type { Props } from '../interface';
import { UPLOAD_URL } from '../const';

export default function useIndex(props: Props, emit: Function) {
    /**
     * 图片路径列表
     */
    const fileList = ref<any[]>([]);

    /**
     * 图片路径
     */
    const uploadValue = ref<string>('');

    /**
     * @description 读取图片后的处理函数
     * @param e index，name，file
     */
    async function handleAfterRead(e: { file: any; name: string; index: number }) {
        let list: any = [].concat(e.file);
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

        emit('handleEmit', {
            value: uploadValue.value,
            schema: props.schema,
            isClear: false,
        });
    }

    /**
     * @description 上传函数
     * @param url 上传地址
     * @return 返回的参数
     */
    async function handleUpload(url: string) {
        return new Promise((resolve) => {
            uni.uploadFile({
                url: UPLOAD_URL,
                filePath: url,
                name: 'file',
                success: (res) => {
                    resolve(JSON.parse(res.data).data);
                },
                fail: (error) => {
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

        emit('handleEmit', {
            value: uploadValue.value,
            schema: props.schema,
            isClear: uploadValue.value ? false : true,
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

            emit('handleEmit', {
                value: uploadValue.value,
                schema: props.schema,
                isClear: false,
            });
            return;
        } else if (params && typeof params === 'string') {
            fileList.value = params.split(',').map((item: string) => {
                return {
                    url: item,
                };
            });

            uploadValue.value = fileList.value.map((item: any) => item.url).toString();

            emit('handleEmit', {
                value: uploadValue.value,
                schema: props.schema,
                isClear: false,
            });
        } else {
            fileList.value = [];
            uploadValue.value = '';
        }
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(() => {
        // 默认值
        if (props.schema?.defaultValue) {
            handleInit(props.schema?.defaultValue);
        }
    });

    return {
        fileList,
        handleAfterRead,
        handleDelete,
        handleInit,
    };
}
