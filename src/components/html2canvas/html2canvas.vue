<template>
    <!-- prop 是自定义的数据字段名，要与 chang 后的保持一致，html2canvas 是 renderjs 的 module 名称 -->
    <!-- TODO: 使用 :change:prop 写法，uni 直接运行可以正确生成 base64，生成资源文件后用基座打包报错？ -->
    <view :id="domId" :prop="domId" class="html2canvas" :change:prop="html2canvas.create">
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

<!-- renderjs 目前仅支持内联使用，vue3 项目不支持 setup script 用法 -->
<script module="html2canvas" lang="renderjs">
import html2canvas from 'html2canvas';

export default {
    methods: {
        /**
         * 创建图片
         * 与 script 通信
         * @param newValue
         * @param oldValue
         * @param ownerInstance
         * @param instance
         */
        async create(newValue) {
            if (!newValue) {
                return;
            }

            // console.log('newValue', newValue);
            // console.log('oldValue', oldValue);
            // console.log('ownerInstance', ownerInstance);
            // console.log('instance', instance);

            try {
                // this.$ownerInstance.callMethod() 仅支持调用逻辑层 vue 选项式中的 methods 中定义的方法。
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
