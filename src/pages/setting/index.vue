<template>
    <view>
        <u-cell-group>
            <u-cell
                icon="account-fill"
                :icon-style="iconStyle"
                :title="$t('setting.account')"
                :value="userInfo.account"
            ></u-cell>
            <u-cell
                icon="account"
                :icon-style="iconStyle"
                :title="$t('setting.userName')"
                :value="userInfo.userName"
            ></u-cell>
            <u-cell icon="list" :icon-style="iconStyle" :title="$t('setting.role')" :value="userInfo.roles"></u-cell>
            <u-cell
                icon="share"
                :icon-style="iconStyle"
                :title="$t('setting.company')"
                :value="userInfo.organizationName"
            ></u-cell>
            <u-cell
                icon="lock-open"
                :icon-style="iconStyle"
                :right-icon-style="iconStyle"
                :title="$t('setting.changePassword')"
                is-link
                @click="handleChangePassword"
            ></u-cell>
            <u-cell
                icon="attach"
                :icon-style="iconStyle"
                :title="$t('setting.appVersion')"
                :value="userInfo.version"
            ></u-cell>
            <u-cell
                icon="reload"
                :icon-style="iconStyle"
                :title="$t('setting.updateVersion')"
                clickable
                @click="checkUpdate"
            ></u-cell>
            <u-cell
                icon="coupon"
                :icon-style="iconStyle"
                :title="$t('setting.printEquip')"
                :value="userInfo.printBrand"
            ></u-cell>
            <u-cell icon="bookmark" :icon-style="iconStyle" :title="$t('setting.language')">
                <template #right-icon>
                    <x-select
                        v-model="userInfo.language"
                        :options="languageList"
                        style="max-width: 400rpx"
                        @change="setLanguage"
                    ></x-select>
                </template>
            </u-cell>
            <u-cell icon="tags" :icon-style="iconStyle" :title="$t('setting.url')">
                <template #right-icon>
                    <u-input
                        v-if="ENV !== 'production'"
                        v-model="userInfo.baseUrl"
                        style="max-width: 400rpx"
                        @blur="handleBlur"
                    ></u-input>
                    <span v-else>{{ userInfo.baseUrl }}</span>
                </template>
            </u-cell>
        </u-cell-group>

        <view style="margin: 24rpx">
            <u-button type="error" @click="showLogout">{{ $t('setting.logOut') }}</u-button>
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
                    <view class="download-style_color">Android/data/</view>
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
    languageList,
    showProgressModal,
    downloadProgress,
    setLanguage,
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
