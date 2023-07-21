<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

onLaunch(() => {
    console.log('App Launch');
});

onShow(() => {
    console.log('App Show');
});

onHide(() => {
    console.log('App Hide');
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给 style 标签加入 lang="scss"属性 */
@import 'uview-plus/index.scss';
</style>
