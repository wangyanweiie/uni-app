<template>
    <view class="view-wrap button-wrap">
        <u-button class="button-wrap__item" type="primary" @click="jump('check-one')">同步校验</u-button>
        <u-button class="button-wrap__item" type="primary" @click="jump('check-two')">依次校验</u-button>
    </view>
</template>
<script lang="ts" setup>
function jump(path: string) {
    uni.navigateTo({
        url: `/pages/other/circulate-form/${path}`,
    });
}
</script>
