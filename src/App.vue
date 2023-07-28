<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { getStorage } from '@/utils/uni-storage';

onShow(() => {
    console.log('App Show');
});

onHide(() => {
    console.log('App Hide');
});

onLaunch(() => {
    console.log('App Launch');

    const token = getStorage('token');

    // 存在 token，首页
    if (token) {
        uni.switchTab({ url: '/pages/index/index' });
    } else {
        // 不存在 token 登录页
        uni.navigateTo({ url: '/pages/login/index' });
    }
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
@import './styles/index.scss';
@import './assets/iconfont.css';
</style>
