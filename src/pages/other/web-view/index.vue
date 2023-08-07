<template>
    <web-view :src="url"></web-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getStorage } from '@/utils/uni-storage';

const token = getStorage('token');
const url = ref(`http://192.168.3.7:5175/plan-management/c-scheduled/list?token=${token}`);
</script>
