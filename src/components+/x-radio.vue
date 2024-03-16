<template>
    <u-form-item :id="$attrs.id ?? prop" :label="label" :prop="prop" :required="required" :label-width="labelWidth">
        <u-radio-group
            :id="$attrs.id ?? prop"
            v-model="radioData"
            :disabled="disabled"
            v-bind="uProps"
            @change="handleGroupChange"
        >
            <u-radio
                v-for="(option, index) in options"
                :key="index"
                class="radio"
                :label-size="uProps?.labelSize"
                :name="option.value"
                :label="option.label"
            ></u-radio>
        </u-radio-group>
    </u-form-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PickerOption } from './interface/interface';
import { Numeric } from '@/constant/base';

const props = withDefaults(
    defineProps<{
        /** 双向绑定 */
        modelValue?: Numeric;
        /** 表单标题 */
        label?: string;
        /** 表单属性 */
        prop?: string;
        /** 是否必填 */
        required?: boolean;
        /** 是否禁用 */
        disabled?: boolean;
        /** 选项列表 */
        options?: PickerOption[];
        /** 表单标题宽度 */
        labelWidth?: string;
        /** 其他属性 */
        uProps?: any;
    }>(),
    {
        modelValue: undefined,
        label: '',
        prop: '',
        required: false,
        disabled: false,
        options: () => [],
        labelWidth: undefined,
        uProps: undefined,
    },
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: Numeric): void;
    (e: 'groupChange', value: Numeric): void;
}>();

/**
 * 单选框数据
 */
const radioData = computed<Numeric>({
    get: () => props.modelValue ?? '',
    set: value => {
        emits('update:modelValue', value);
    },
});

/**
 * 改变任意单选框触发
 * @param value 当前选择值
 */
function handleGroupChange(value: Numeric) {
    emits('groupChange', value);
}
</script>

<style lang="scss" scoped>
.radio {
    margin-right: 10px;
}
</style>
