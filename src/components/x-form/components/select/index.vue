<template>
    <view class="component">
        <data-select
            v-model="selectValue"
            :localdata="selectList"
            placeholder="请选择"
            v-bind="schema?.attributes"
            :clear="schema?.attributes?.clearable"
            @change="handleChange"
        ></data-select>
    </view>
</template>

<script lang="ts">
export default {
    name: 'BaseSelect',
};
</script>

<script setup lang="ts">
import useIndex from './useIndex';
import DataSelect from './dataSelect.vue';
import type { Schema, Options } from '../../interface';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        schema: Schema;
    }>(),
    {
        schema: () => {
            return {
                prop: '',
                label: '',
                type: 'BaseSelect',
            };
        },
    },
);

/**
 * emit
 */
const emit = defineEmits<{
    (e: 'handleSelect', val: { value: Options; formItem: Schema }): void;
}>();

/**
 * useIndex
 */
const { selectValue, selectList, handleChange, handleSelect } = useIndex(props, emit);

/**
 * 暴露的属性与方法
 */
defineExpose({
    async setData(val: string | number) {
        selectValue.value = val;

        // 更新下拉列表
        handleSelect();
    },
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}
</style>
