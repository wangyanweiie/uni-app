import { ref, onBeforeMount } from 'vue';
import type { Options } from '../../interface';
import type { Props, RequestObj } from '../interface';

export default function useIndex(props: Props, emit: any) {
    /**
     * 下拉值
     */
    const selectValue = ref<string | number>('');

    /**
     * 下拉值对应的 label
     */
    const selectLabel = ref<string>('');

    /**
     * 下拉列表
     */
    const selectList = ref<Options[]>([]);

    /**
     * @description 下拉框改变
     * @param e 当前下拉项
     */
    function handleChange(e: string | number) {
        if (e) {
            // 根据 value 过滤出当前下拉项的 label
            selectLabel.value = selectList.value.filter((item: Options) => item.value === e)[0]?.label;
            selectValue.value = e;
        } else {
            // 清空
            selectLabel.value = '';
            selectValue.value = '';
        }

        emit('handleSelect', {
            value: { label: selectLabel.value, value: selectValue.value },
            schema: props.schema,
            isClear: e ? false : true,
        });
    }

    /**
     * 请求下拉数据
     */
    async function handleSelect() {
        if (props.schema?.api) {
            // 动态赋值
            const res: RequestObj = await props.schema?.api({
                ...props.schema?.apiParams,
            });

            if (res) {
                selectList.value = res.data as Options[];
            } else {
                selectList.value = [];
            }
        } else if (props.schema?.options?.length) {
            // 静态赋值
            selectList.value = props.schema?.options;
        } else {
            selectList.value = [];
        }
    }

    /**
     * 页面渲染之前
     */
    onBeforeMount(async () => {
        // 下拉列表赋值
        handleSelect();

        // 默认值
        if (props.schema?.defaultValue) {
            selectList.value.forEach((item: Options) => {
                if (item.value === props.schema?.defaultValue) {
                    selectValue.value = item.value;
                    selectLabel.value = item.label;
                }
            });

            emit('handleSelect', {
                value: { label: selectLabel.value, value: selectValue.value },
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        selectValue,
        selectList,
        handleChange,
        handleSelect,
    };
}
