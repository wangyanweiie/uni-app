<template>
    <view>
        <u-form-item :id="$attrs.id ?? prop" :required="required" :label="label" :prop="prop">
            <u-input
                ref="inputRef"
                v-model="labelName"
                clearable
                readonly
                :prefix-icon="prefixIcon"
                border="none"
                :placeholder="placeholder ?? `请选择${label ?? ''}`"
                :disabled="disabled"
                @click="handleOpen"
                @clear="handleClear"
            >
                <template #suffix>
                    <u-icon v-if="!disabled" name="arrow-right" size="20px" />
                </template>
            </u-input>
        </u-form-item>

        <u-picker
            :columns="uPickerColumns"
            :show="pickerVisible"
            close-on-click-overlay
            :cancel-text="cancelText"
            :confirm-text="confirmText"
            @confirm="handleConfirm"
            @cancel="handleClear"
            @close="handleClose"
        />
    </view>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted, computed } from 'vue';
import type { Numeric } from 'src/constant/global';
import type { PickerOption } from './interface';

// FIXME 触发表单change事件有问题

const props = withDefaults(
    defineProps<{
        modelValue: any;
        text?: string;
        api?: (data?: any) => Promise<any>;
        apiParams?: any;
        options?: PickerOption[];
        label?: string;
        prop?: string;
        placeholder?: string;
        required?: boolean;
        disabled?: boolean;
        prefixIcon?: string;
        cancelText?: string;
        confirmText?: string;
    }>(),
    {
        text: undefined,
        api: undefined,
        apiParams: undefined,
        options: () => [],
        label: '',
        prop: undefined,
        placeholder: undefined,
        required: false,
        disabled: false,
        prefixIcon: undefined,
        cancelText: '清空',
        confirmText: '确定',
    }
);

const emits = defineEmits<{
    (e: 'update:modelValue', value: any): void;
    (e: 'update:text', value: any): void;
    (e: 'confirm', value: any): void;
    (e: 'clear'): void;
}>();

const labelName = ref<Numeric | undefined>();

const pickerVisible = ref<boolean>(false);

const pickerColumns = ref<any[]>(props.options);

const uPickerColumns = computed<string[][]>(() => {
    return [pickerColumns.value?.map((col) => col.label) ?? []];
});

const selected = ref<string[]>();

/**
 * 打开
 */
async function handleOpen(): Promise<void> {
    if (props.disabled) {
        return;
    }

    if (!props.api) {
        pickerVisible.value = true;
        return;
    }

    const res = await getAPIData();

    if (res) {
        pickerVisible.value = true;
    }
}

function handleClose(): void {
    pickerVisible.value = false;
}

const inputRef = ref<any>();

/**
 * 确认选中
 */
function handleConfirm(data: { indexs: number[] }): void {
    const { indexs } = data;

    if (indexs && pickerColumns.value) {
        const { value } = pickerColumns.value[indexs[0]];

        // 更新text
        const matchedOption = pickerColumns.value.find((option) => option.value === value);

        if (matchedOption) {
            labelName.value = matchedOption.label;

            selected.value = [matchedOption.value];
        } else {
            labelName.value = undefined;
            selected.value = [];
        }

        emits('update:text', labelName.value);
        emits('update:modelValue', value);
        emits('confirm', value);
    }

    pickerVisible.value = false;
}

/**
 * 清空
 */
function handleClear(): void {
    emits('update:modelValue', undefined);
    emits('update:text', undefined);
    emits('clear');
    pickerVisible.value = false;
}

async function getAPIData(): Promise<boolean> {
    if (!props.api) {
        return false;
    }

    const res = await props.api(props.apiParams);

    if (!res) {
        return false;
    }

    pickerColumns.value = res.data;

    return true;
}

watchEffect(() => {
    if (!props.api) {
        pickerColumns.value = props.options;
    }
    labelName.value = props.text;

    // 更新text
    const matchedOption = pickerColumns.value.find((option) => option.value === props.modelValue);

    if (matchedOption) {
        labelName.value = matchedOption.label;
        selected.value = [props.modelValue];
    } else {
        // labelName.value = undefined;
        selected.value = [];
    }

    const matchedLabelOption = pickerColumns.value.find((option) => option.label === props.text);

    if (matchedLabelOption) {
        emits('update:modelValue', matchedLabelOption.value);
        selected.value = [props.modelValue];
    } else {
        // labelName.value = undefined;
        selected.value = [];
    }
});

onMounted(() => {
    getAPIData();
});
</script>

<style scoped lang="scss">
:deep(.u-icon__icon) {
    margin-left: 10px;
}
</style>
