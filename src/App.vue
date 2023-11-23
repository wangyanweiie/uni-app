<script setup lang="ts">
import { onLaunch } from '@dcloudio/uni-app';
import { getStorage, removeStorage } from '@/utils/uni-storage';
import { LOCAL_TOKEN_KEY } from './constant/global';
import RequestAPI from '@/api/login/index';

/**
 * 校验 token 是否存在
 */
async function checkTokenIsExit() {
    const token = getStorage(LOCAL_TOKEN_KEY);

    if (!token) {
        // 若不存在，跳转至登录页
        uni.navigateTo({
            url: '/pages/login/index',
        });
        return;
    }

    // 若存在，则校验 token 有效性
    await checkTokenIsValid();
}

/**
 * 校验 token 是否有效
 */
async function checkTokenIsValid() {
    // const res = await RequestAPI.checkToken();

    // if (!res) {
    //     // 若无效，清空 token 并跳转至登录页
    //     removeStorage(LOCAL_TOKEN_KEY);
    //     uni.navigateTo({
    //         url: '/pages/login/index',
    //     });
    //     return;
    // }

    // 若有效，则跳转至首页
    uni.switchTab({
        url: '/pages/index/index',
    });
}

onLaunch(() => {
    checkTokenIsExit();
});
</script>
<style lang="scss">
/* 注意要写在第一行，同时给 style 标签加入 lang="scss"属性 */
@import 'uview-plus/index.scss';
@import './styles/index.scss';
@import './assets/iconfont.css';
</style>
