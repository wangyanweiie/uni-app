<template>
    <view class="wrap">
        <view class="uploader__input-box">
            <template v-for="(file, index) in fileList" :key="index">
                <view class="uni-uploader__file">
                    <u-icon
                        class="icon-delete"
                        name="close"
                        size="8"
                        @tap="deleteFile(index)"
                    ></u-icon>
                    <image
                        v-if="file.type === 'image'"
                        class="uni-uploader__img"
                        :src="file.url"
                        :data-src="file.url"
                        @tap="previewImage(file.url)"
                    ></image>
                    <video
                        v-if="file.type === 'video'"
                        :id="`video_play_${props.propName}_${index}`"
                        class="uni-uploader__video"
                        :src="file.url"
                        :show-center-play-btn="false"
                        :controls="true"
                        object-fit="fill"
                        @play="handlePlay(index)"
                        @fullscreenchange="handleFullScreen($event, index)"
                    ></video>
                </view>
            </template>
            <u-loading-icon class="loading" :show="loading"></u-loading-icon>
            <view class="uni-uploader__file" @tap="chooseVideoImage">
                <u-icon name="plus" size="42" color="#909399" @tap="chooseVideoImage"></u-icon>
            </view>
        </view>
    </view>
</template>
<script lang="ts" setup>
import { ref, watch } from 'vue';
import { chooseFileType, chooseImage, chooseVideo } from './use-upload';
import { showToast } from 'src/utils/u-toast';
import type { UploadFileOption } from '../interface';
import { watchEffect } from 'vue';

// TODO: 优化毛俊杰代码

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /**
         * 双向绑定的值 => 用于展示的 label
         */
        modelValue: UploadFileOption[];
        /**
         * 限定的视频大小（单位:MB）
         */
        limitSize?: number | string;
        /**
         * 提交时需要的参数名
         */
        propName?: string;
    }>(),
    {
        modelValue: () => [],
        limitSize: 100,
        propName: '',
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value?: UploadFileOption[]): void;
}>();

enum FileType {
    image = 0,
    video = 1,
}

/**
 * 文件列表
 */
const fileList = ref<UploadFileOption[]>(props.modelValue);

/**
 * 下载接口url
 */
const apiUrl = import.meta.env.VITE_API_URL;

/**
 * loading
 */
const loading = ref<boolean>(false);

watchEffect(() => {
    fileList.value = props.modelValue;
});

/**
 * 选择图片还是视频
 */
async function chooseVideoImage() {
    const actionSheet = await chooseFileType();
    if (!actionSheet) {
        return;
    }

    if (actionSheet.tapIndex === FileType.image) {
        const images = await chooseImage();
        if (!images) {
            return;
        }

        loading.value = true;
        const { tempFilePaths } = images;

        (tempFilePaths as string[]).map(async (url: string) => {
            uni.uploadFile({
                url: `${apiUrl}/api/upload`,
                filePath: url,
                name: 'file',
                success: (res: any) => {
                    const resp = JSON.parse(res.data);
                    if (resp.code !== 200) {
                        loading.value = false;
                        showToast('上传失败');
                        return false;
                    } else {
                        fileList.value.push({
                            type: 'image',
                            status: 'success',
                            message: '',
                            url: resp.data,
                        });

                        loading.value = false;
                        showToast('上传成功');

                        emits('update:modelValue', fileList.value);
                    }
                },
                fail: () => {
                    loading.value = false;
                    showToast('上传失败');
                    return false;
                },
            });
        });
    } else if (actionSheet.tapIndex === FileType.video) {
        const videos = await chooseVideo();
        if (!videos) {
            return;
        }

        loading.value = true;
        const { tempFilePath, size } = videos;

        /**
         * 单位转换，计算出是否在设置的视频限定大小范围以内
         */
        const MbSize = Math.ceil(size / (1024 * 1024));
        console.log('MbSize:', MbSize);

        if (MbSize > +props.limitSize) {
            showToast('视频大小超出限定范围（100MB）');
            loading.value = false;
            return;
        }
        const videoFile = {
            type: 'video',
            path: tempFilePath,
            size: size,
        };

        uni.uploadFile({
            url: `${apiUrl}/api/upload`,
            filePath: videoFile.path,
            name: 'file',
            // timeout: 1000 * 60 * 5,
            success: (res: any) => {
                const resp = JSON.parse(res.data);
                if (resp.code !== 200) {
                    loading.value = false;
                    showToast('上传失败');
                    return false;
                } else {
                    console.log(resp, '上传结果');
                    fileList.value.push({
                        type: 'video',
                        status: 'success',
                        message: '',
                        url: resp.data,
                    });
                    loading.value = false;
                    showToast('上传成功');

                    emits('update:modelValue', fileList.value);
                }
            },
            fail: () => {
                loading.value = false;
                showToast('上传失败');
                return false;
            },
        });
    }
}

/**
 * 删除文件
 */
function deleteFile(index: number) {
    fileList.value.splice(index, 1);

    emits('update:modelValue', fileList.value);
}

/**
 * 预览图片
 */
function previewImage(url: string) {
    console.log('url:', url);

    uni.previewImage({
        current: url,
        urls: [url],
    });
}

/**
 * 预览视频
 */
function handlePlay(index: number) {
    const videoContext = uni.createVideoContext(`video_play_${props.propName}_${index}`);
    videoContext.requestFullScreen({ direction: 0 });
}

function handleFullScreen(e: any, index: number) {
    const videoContext = uni.createVideoContext(`video_play_${props.propName}_${index}`);

    const isFullScreen: boolean = e.detail.fullScreen;

    if (!isFullScreen) {
        videoContext.pause();
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
}

.uploader__input-box {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
}

.uni-uploader__file {
    position: relative;
    width: 62px;
    height: 62px;
    border: 1px solid #909399;
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 8px;
}

.uni-uploader__img,
.uni-uploader__video {
    width: 100%;
    height: 100%;
}

.icon-delete {
    width: 14px;
    height: 14px;
    text-align: center;
    position: absolute;
    right: -7px;
    top: -7px;
    background: #909399;
    color: rgb(255, 255, 255);
    z-index: 1;
    padding-left: 2px;
    border-radius: 50%;
    text-align: center;
}

.loading {
    width: 100%;
    height: 100%;
}
</style>
