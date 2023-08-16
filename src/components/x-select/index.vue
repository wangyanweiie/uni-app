<template>
    <view class="component">
        <data-select
            v-model="myModelValue"
            :localdata="dataSource"
            :placeholder="placeholder"
            :disabled="disabled"
            :clear="clearable"
            @change="handleChange"
        ></data-select>
    </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import DataSelect from './dataSelect.vue';
import { useVModel } from '@vueuse/core';
import type { Options } from './interface';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        /** 双向绑定的值 */
        modelValue: string | number;
        /** 提示文字 */
        placeholder?: string;
        /** 是否禁用 */
        disabled?: boolean;
        /** 是否可清空 */
        clearable?: boolean;
        /** 下拉请求接口 */
        api?: any;
        /** 下拉请求接口参数 */
        apiParams?: Record<string, string | number>;
        /** 单选/复选框静态列表 */
        options?: Options[];
    }>(),
    {
        modelValue: '',
        api: '',
        apiParams: () => {
            return {};
        },
        options: () => {
            return [];
        },
        placeholder: '请选择',
        disabled: false,
        clearable: false,
    },
);

/**
 * emit
 */
const emits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'change', value: object): any;
}>();

/**
 * 双向绑定的值
 */
const myModelValue = useVModel(props, 'modelValue', emits);

/**
 * 下拉列表
 */
const dataSource = ref<Record<string, string | number>[]>([]);

/**
 * 数据加载
 */
async function loadData() {
    if (props?.api) {
        const res: any = await props.api({
            ...props.apiParams,
        });

        if (res.data) {
            dataSource.value = res.data?.map((item: Options) => {
                return {
                    ...item,
                    text: item.label,
                };
            });
        }
    } else {
        dataSource.value = props.options.map((item: Options) => {
            return {
                ...item,
                text: item.label,
            };
        });
    }
}

/**
 * 改变下拉项
 * @param e 下拉项的 value
 */
function handleChange(e: number | string) {
    const obj = dataSource.value.filter(item => item.value === e);

    // 返回当前下拉的 label value 对象
    if (obj.length) {
        emits('change', obj[0]);
    }
}

/**
 * 静态数据需要二次赋值
 */
watch(
    () => props.options,
    (newValue: any) => {
        if (Array.isArray(newValue)) {
            loadData();
        }
    },
);

/**
 * 页面渲染
 */
onMounted(async () => {
    await loadData();
});

/**
 * 暴露的属性与方法
 */
defineExpose({
    loadData,
});
</script>
<style lang="scss" scoped>
.component {
    width: 100%;
}
</style>
