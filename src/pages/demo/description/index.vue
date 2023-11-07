<template>
    <view class="view-wrap wrap">
        <!-- <uni-row class="search">
            <uni-col :span="12">
                <x-date-picker
                    v-model="searchForm.startTime"
                    date-type="date"
                    :clearable="true"
                    placeholder="登录日期"
                    @change="handleDate"
                ></x-date-picker>
            </uni-col>
            <uni-col :span="12">
                <u-input
                    v-model="searchForm.userName"
                    clearable
                    placeholder="登录人"
                    @blur="userNameBlur"
                    @clear="userNameClear"
                />
            </uni-col>
        </uni-row> -->

        <x-descriptions ref="descriptionRef" :columns="columns" :api="api" :api-params="apiParams">
            <template #search>
                <uni-row>
                    <uni-col :span="12">
                        <x-date-picker
                            v-model="searchForm.startTime"
                            date-type="date"
                            :clearable="true"
                            placeholder="登录日期"
                            @change="handleDate"
                        ></x-date-picker>
                    </uni-col>
                    <uni-col :span="12">
                        <u-input
                            v-model="searchForm.userName"
                            clearable
                            placeholder="登录人"
                            @blur="userNameBlur"
                            @clear="userNameClear"
                        />
                    </uni-col>
                </uni-row>
            </template>

            <template #topLeft="{ row }">
                <view>登录时间：{{ row.addTime }}</view>
            </template>

            <template #topRight="{ row }">
                <u-tag
                    :text="STATUS[row.status]"
                    :type="STATUS[row.status] === '成功' ? 'success' : 'error'"
                    size="mini"
                ></u-tag>
            </template>

            <template #addTimeSlot="{ row }">
                {{ dayjs(row.addTime).format('YYYY-MM-DD') }}
            </template>
        </x-descriptions>
    </view>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import RequestAPI from './api';
import { STATUS, columnList } from './conf';

/**
 * 查询表单
 */
const searchForm = ref<Record<string, string>>({
    userName: '',
    startTime: '',
});

async function userNameBlur(e: string) {
    searchForm.value.userName = e;
    descriptionRef.value.loadData(searchForm.value);
}

async function userNameClear() {
    searchForm.value.userName = '';
    descriptionRef.value.loadData(searchForm.value);
}

function handleDate(e: { value: string }) {
    searchForm.value.startTime = e.value;
    searchForm.value.endTime = e.value;
    descriptionRef.value.loadData(searchForm.value);
}

/**
 * 描述列
 */
const descriptionRef = ref();
const columns = columnList;
const api = RequestAPI.index;
const apiParams = {
    type: 2,
};
</script>
<!-- <style lang="scss" scoped>
.wrap {
    position: relative;

    .search {
        position: sticky;
        top: 88rpx;
        z-index: 3;
        padding: 10rpx 0;
        background-color: #fff;
    }
}
</style> -->
