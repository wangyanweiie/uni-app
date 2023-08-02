import { onMounted, ref, watch, nextTick, onBeforeMount } from 'vue';
import _ from 'lodash-es';
import type { Options, Props } from './interface';

export default function useIndex(props: Props, emit: Function) {
    /**
     * 页面渲染
     */
    onMounted(() => {
        handleSearchSelect();
    });

    /**
     * 监听 props
     */
    watch(
        () => props.modelValue,
        newValue => {
            text.value = newValue;
        }
    );

    /**
     * 双向绑定的值
     */
    const text = ref<string>('');

    /**
     * 渲染组件类型
     */
    const selectType = ref<string>('radio');

    /**
     * 是否展示弹出层
     */
    const showPopup = ref<boolean>(false);

    /**
     * 搜索框关键词
     */
    const keyword = ref<string | number>();

    /**
     * 单选/复选框下拉列表
     */
    const sourceList = ref<Options[]>([]); // 源数据
    const showList = ref<Options[]>([]); // 筛选后展示的列表

    /**
     * 单选框
     */
    const radioValue = ref<string | number>(); // 当前单选值

    /**
     * 复选框
     */
    const checkboxValue = ref<(string | number)[]>([]); // 当前复选值
    const lastCheckboxValue = ref<(string | number)[]>([]); // 上一次的复选值

    /**
     * 清空文本值
     */
    function handleTextClear() {
        text.value = '';
        emit('update:modelValue', text.value);
        emit('clear');
    }

    /**
     * 初始化数据列表
     */
    async function handleSearchSelect() {
        if (props.api) {
            // 动态赋值
            const res: any = await props.api({
                ...props?.apiParams,
            });
            if (res && res.data) {
                // 单选/复选
                sourceList.value = res.data;
                showList.value = sourceList.value;
            }
        } else {
            // 静态赋值
            sourceList.value = props.options as Options[];
            showList.value = sourceList.value;
        }
    }

    /**
     * 打开弹出层
     */
    function handlePopupOpen() {
        // 静态赋值时需要二次触发才能拿到数据
        if (!props.api) {
            handleSearchSelect();
        }

        // 反显上一次选择的值
        if (text.value) {
            switch (selectType.value) {
                case 'radio':
                    sourceList.value.forEach((item: Options) => {
                        if (item.label === text.value) {
                            radioValue.value = item.value;
                        }
                    });
                    break;

                case 'checkbox':
                    let boxValue: any = [];
                    sourceList.value.forEach((item: Options) => {
                        String(text.value)
                            .split(',')
                            .forEach(value => {
                                if (value === item.label) {
                                    boxValue.push(item.value);
                                }
                            });
                    });
                    checkboxValue.value = boxValue;
                    lastCheckboxValue.value = boxValue;
                    break;
            }
        } else {
            radioValue.value = '';
            checkboxValue.value = [];
            lastCheckboxValue.value = [];
        }

        showPopup.value = true;
    }

    /**
     * 关闭弹出层
     */
    function handlePopupClose() {
        keyword.value = '';
        showList.value = sourceList.value;
        showPopup.value = false;
    }

    /**
     * 手动更新渲染 DOM
     * FIXME: 解决 "单选过滤后选择 - 清空过滤条件 - 相同位置会出现假选中状态" 的问题
     */
    function handleUpdateDom() {
        selectType.value = '';
        nextTick(() => {
            if (props.multiple) {
                selectType.value = 'checkbox';
            } else {
                selectType.value = 'radio';
            }
        });
    }

    /**
     * 单选 change
     */
    function handleRadioChange(e: any) {
        // 已双向绑定，无需手动赋值
        // radioValue.value = e;
    }

    /**
     * 剔除两数组中的相同项，返回合并后的新数组
     */
    function delIntersection(arr1: (number | string)[], arr2: (number | string)[]) {
        const arr = [...arr1, ...arr2];
        const newArr = arr.filter(item => {
            return !(arr1.includes(item) && arr2.includes(item));
        });
        return newArr;
    }

    /**
     * 整合复选数据
     * FIXME: 解决直接赋值会导致：勾选 -- 过滤 -- 再次勾选，会清空过滤前已选中值的问题
     */
    function mergeChecked(e: (number | string)[]) {
        const filterList = delIntersection(lastCheckboxValue.value, e);

        // 遍历合并后的数组
        for (let i = 0; i < filterList.length; i++) {
            // 判断上次选中的集合中是否已经包含元素
            const res = lastCheckboxValue.value.includes(filterList[i]);

            if (!res) {
                // ① 若不包含，则添加 ==> 合并本次与上次选择的数据到 lastCheckboxValue 集合中
                lastCheckboxValue.value.push(filterList[i]);
            } else {
                // ② 若包含，判断是否存在于当前展示的下拉列表中，并判断是否在本次选中的集合中
                const isShow = showList.value.map(item => item.value).includes(filterList[i]);
                const isSelect = e.includes(filterList[i]);

                // 若存在于当前展示的下拉列表，但未被本次选中 ==> 从 lastCheckboxValue 集合中剔除
                if (isShow && !isSelect) {
                    let delIndex = 0;
                    lastCheckboxValue.value?.forEach((item: any, index: number) => {
                        if (item === filterList[i]) {
                            delIndex = index;
                        }
                    });
                    lastCheckboxValue.value.splice(delIndex, 1);
                }
            }
        }

        lastCheckboxValue.value = [...new Set(lastCheckboxValue.value)];
    }

    /**
     * 复选 change
     */
    function handleCheckChange(e: any[]) {
        if (!lastCheckboxValue.value.length) {
            // FIXME: 此处没能双向绑定到  checkboxValue，需要手动赋值？
            checkboxValue.value = e;
            lastCheckboxValue.value = _.cloneDeep(checkboxValue.value);
        } else {
            mergeChecked(e);
            nextTick(() => {
                checkboxValue.value = _.cloneDeep(lastCheckboxValue.value);
            });
        }
    }

    /**
     * 搜索回调
     */
    function handleSearchSearch(e: string) {
        if (!e) {
            showList.value = sourceList.value;
        } else {
            let list: Options[] = [];
            sourceList.value.forEach((item: Options) => {
                if (item.label.match(e)) {
                    list.push(item);
                }
            });
            showList.value = list;
        }

        handleUpdateDom();
    }

    /**
     * 清空搜索
     */
    function handleSearchClear() {
        showList.value = sourceList.value;
        handleUpdateDom();
    }

    /**
     * 确认选择
     */
    function handleButtonConfirm() {
        switch (selectType.value) {
            case 'radio':
                let label: string = '';
                sourceList.value.forEach(item => {
                    if (String(radioValue.value) === String(item.value)) {
                        label = item.label;
                    }
                });

                text.value = label;
                emit('update:modelValue', text.value);
                emit('change', { value: radioValue.value });

                // console.log('当前选择的单选框 label:', text.value);
                // console.log('当前选择的单选框 value:', checkboxValue.value);
                break;

            case 'checkbox':
                let labelList: string[] = [];
                sourceList.value.forEach(item => {
                    checkboxValue.value.forEach(value => {
                        if (value === item.value) {
                            labelList.push(item.label);
                        }
                    });
                });

                text.value = labelList.toString();
                emit('update:modelValue', text.value);
                emit('change', { value: checkboxValue.value });

                // console.log('当前选择的复选框 label 字符串:', text.value);
                // console.log('当前选择的复选框 value 集合:', checkboxValue.value);
                break;
        }

        handlePopupClose();
    }

    /**
     * 取消选择
     */
    function handleButtonCancel() {
        handlePopupClose();
    }

    /**
     * 页面渲染
     */
    onBeforeMount(() => {
        // 单选 or 多选
        if (props.multiple) {
            selectType.value = 'checkbox';
        } else {
            selectType.value = 'radio';
        }
    });

    return {
        text,
        handleTextClear,
        showPopup,
        handlePopupOpen,
        handlePopupClose,
        selectType,
        handleButtonConfirm,
        handleButtonCancel,
        keyword,
        handleSearchSearch,
        handleSearchClear,
        radioValue,
        handleRadioChange,
        checkboxValue,
        handleCheckChange,
        showList,
    };
}
