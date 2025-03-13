<template>
    <view class="html2canvas" :prop="domId" :change:prop="html2canvas.handleCreate">
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

<script module="html2canvas" lang="renderjs">
import html2canvas from 'html2canvas';

export default {
    methods: {
        /**
         * 创建图片
         */
        async handleCreate(domId) {
            if (!domId) {
                return;
            }

            try {
                this.$ownerInstance.callMethod('showLoading', true);

                const timeout = setTimeout(async ()=> {
                    const shareContent = document.querySelector(domId);
                    const canvas = await html2canvas(shareContent,{
                        width: shareContent?.offsetWidth, // 设置 canvas 尺寸与所截图尺寸相同，防止白边
                        height: shareContent?.offsetHeight, // 防止白边
                        logging: true,
                        useCORS: true
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
