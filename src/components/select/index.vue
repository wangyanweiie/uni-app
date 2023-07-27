<template>
    <data-select v-model="myModelValue" :localdata="dataSource" :placeholder="placeholder"></data-select>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import DataSelect from './dataSelect.vue';
import { useVModel } from '@vueuse/core';

/**
 * props
 */
const props = withDefaults(
    defineProps<{
        modelValue: string | number;
        api?: any;
        apiParams?: Object;
        options?: Record<string, string | number>[];
        placeholder: string;
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
    },
);

/**
 * emit
 */
const emits = defineEmits<{
    (e: 'update:modelValue', value: string | number): void;
    (e: 'callBack', value: object): any;
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
            dataSource.value = res.data?.map((item: Record<string, string | number>) => {
                return {
                    ...item,
                    text: item.label,
                };
            });
        }
    } else {
        dataSource.value = props.options.map((item: Record<string, string | number>) => {
            return {
                ...item,
                text: item.label,
            };
        });
    }
}

/**
 * 监听
 */
watch(
    () => myModelValue.value,
    (newValue: any) => {
        let obj = dataSource.value.filter(item => item.value === newValue);

        // 返回当前下拉的 label value 对象
        if (obj.length) {
            emits('callBack', obj[0] || {});
        }
    },
);

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
