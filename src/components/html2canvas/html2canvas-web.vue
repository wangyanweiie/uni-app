<template>
    <view :id="domId">
        <slot />
    </view>
</template>

<script lang="ts" setup>
import html2canvas from 'html2canvas';
import { watch } from 'vue';

/**
 * 定义组件选项
 */
defineOptions({
    name: 'Html2canvas',
});

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        domId: string;
    }>(),
    {
        domId: '',
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (event: 'renderFinish', value: string): void;
}>();

/**
 * 渲染完成
 */
function renderFinish(base64: string) {
    try {
        emit('renderFinish', base64);
    } catch (e) {
        console.log('html2canvas error', e);
    }
}

/**
 * show loading
 */
function showLoading() {
    uni.showToast({
        title: '正在生成',
        icon: 'none',
    });
}

/**
 * hide loading
 */
function hideLoading() {
    uni.hideToast();
}

/**
 * 创建图片
 */
function create(domId: string) {
    console.log('create', domId);

    try {
        showLoading();

        const timeout = setTimeout(async () => {
            const shareContent: any = document.getElementById(domId);

            const canvas = await html2canvas(shareContent, {
                width: shareContent?.offsetWidth, // 设置 canvas 尺寸与所截图尺寸相同，防止白边
                height: shareContent?.offsetHeight, // 防止白边
                logging: true,
                useCORS: true,
                scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
            });

            const base64 = canvas.toDataURL('image/png', 1);

            renderFinish(base64);
            hideLoading();

            clearTimeout(timeout);
        }, 500);
    } catch (error) {
        console.log(error);
    }
}

/**
 * 监听 domId
 */
watch(
    () => props.domId,
    newValue => {
        if (newValue) {
            create(newValue);
        }
    },
);
</script>
