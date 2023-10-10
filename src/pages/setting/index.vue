<template>
    <view>
        <u-cell-group>
            <u-cell
                icon="account-fill"
                :icon-style="iconStyle"
                title="账号"
                size="large"
                :value="userInfo.account"
            ></u-cell>
            <u-cell
                icon="account"
                :icon-style="iconStyle"
                title="用户名"
                size="large"
                :value="userInfo.userName"
            ></u-cell>
            <u-cell icon="list" :icon-style="iconStyle" title="角色" size="large" :value="userInfo.roles"></u-cell>
            <u-cell
                icon="share"
                :icon-style="iconStyle"
                title="公司"
                size="large"
                :value="userInfo.organizationName"
            ></u-cell>
            <u-cell
                icon="lock-open"
                :icon-style="iconStyle"
                :right-icon-style="iconStyle"
                title="修改密码"
                size="large"
                is-link
                @click="handleChangePassword"
            ></u-cell>
            <u-cell
                icon="attach"
                :icon-style="iconStyle"
                title="应用版本"
                size="large"
                :value="userInfo.version"
            ></u-cell>
            <u-cell
                icon="reload"
                :icon-style="iconStyle"
                title="更新版本"
                size="large"
                clickable
                @click="checkUpdate"
            ></u-cell>
            <u-cell
                icon="coupon"
                :icon-style="iconStyle"
                title="打印设备"
                size="large"
                :value="userInfo.printBrand"
                @click="checkUpdate"
            ></u-cell>
            <u-cell icon="tags" :icon-style="iconStyle" title="BASE_URL" size="large" :value="userInfo.baseUrl">
                <!-- <template #right-icon>
                    <u-input v-model="userInfo.baseUrl" :disabled="ENV === 'production'" @blur="handleBlur"></u-input>
                </template> -->
            </u-cell>
        </u-cell-group>

        <view style="margin: 24rpx">
            <u-button type="error" @click="showLogout">退出登录</u-button>
        </view>

        <!-- 测试环境在线更新：显示下载进度 -->
        <u-modal :show="showProgressModal" :show-confirm-button="false">
            <view class="download-style">
                <view class="download-style_item">
                    <span>下载进度 : </span>
                    <span class="download-style_color">{{ downloadProgress }}</span>
                </view>
                <view>
                    <view class="download-style_gap">保存路径 : </view>
                    <view class="download-style_color">Android/data/...</view>
                </view>
            </view>
        </u-modal>
    </view>
</template>

<script lang="ts" setup>
import { ENV } from '@/constant/global';
import useIndex from './useIndex';

const {
    userInfo,
    iconStyle,
    showProgressModal,
    downloadProgress,
    showLogout,
    checkUpdate,
    handleChangePassword,
    handleBlur,
} = useIndex();
</script>
<style lang="scss" scoped>
.download-style {
    overflow-x: auto;

    &_item {
        margin-bottom: 14rpx;
    }

    &_gap {
        margin-bottom: 10rpx;
    }

    &_color {
        color: #42b983;
    }
}
</style>
