<template>
    <!-- prop 是自定义的数据字段名，要与 chang 后的保持一致，canvasModule 是 renderjs 的 module 名称 -->
    <view :id="domId" :prop="domId" :change:prop="canvasModule.handleCreate" class="html2canvas">
        <slot />
    </view>
</template>

<script>
export default {
    name: 'Html2canvas',

    props: {
        domId: {
            type: String,
            required: true,
        },
    },

    emits: ['renderFinish'],

    methods: {
        /**
         * 渲染完成
         */
        async renderFinish(base64) {
            try {
                this.$emit('renderFinish', base64);
            } catch (e) {
                console.log('html2canvas error', e);
            }
        },

        /**
         * show loading
         */
        showLoading() {
            uni.showToast({
                title: '正在生成',
                icon: 'none',
            });
        },

        /**
         * hide loading
         */
        hideLoading() {
            uni.hideToast();
        },
    },
};
</script>

<!-- renderjs 目前仅支持内联使用 -->
<script module="canvasModule" lang="renderjs">
import html2canvas from 'html2canvas';

export default {
    methods: {
        /**
         * 创建图片
         * 与 script 通信
         */
        async handleCreate(newValue, oldValue, ownerInstance, instance) {
            if (!newValue) {
                return;
            }

            console.log('newValue', newValue);
            console.log('oldValue', oldValue);
            console.log('ownerInstance', ownerInstance);
            console.log('instance', instance);

            try {
                this.$ownerInstance.callMethod('showLoading', true);

                const timeout = setTimeout(async ()=> {
                    const shareContent = document.getElementById(newValue);
                    const canvas = await html2canvas(shareContent,{
                        width: shareContent?.offsetWidth, // 设置 canvas 尺寸与所截图尺寸相同，防止白边
                        height: shareContent?.offsetHeight, // 防止白边
                        logging: true,
                        useCORS: true,
                        scale: window.devicePixelRatio < 3 ? window.devicePixelRatio : 2,
                    });

                    const base64 = canvas.toDataURL('image/png', 1);

                    this.$ownerInstance.callMethod('renderFinish', base64);
                    this.$ownerInstance.callMethod('hideLoading', true);

                    clearTimeout(timeout);
                }, 500);
            } catch(error){
                console.log(error)
            }
        }
    }
}
</script>
