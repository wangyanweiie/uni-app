import { onMounted, ref, nextTick, onBeforeMount } from 'vue';
import type { Options } from '../../interface';
import type { Props } from '../interface';
import _ from 'lodash-es';

export default function useIndex(props: Props, emit: Function) {
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
     * 选中值对应的 label
     */
    const selectLabel = ref<string>('');

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
     * 清空文本值
     */
    function handleClear() {
        selectLabel.value = '';

        emit('handleSelect', {
            value: { label: '', value: '' },
            schema: props.schema,
            isClear: true,
        });
    }

    /**
     * 初始化数据列表
     */
    async function handleSearchSelect() {
        if (props.schema.api) {
            // 动态赋值
            const res: any = await props.schema.api({
                ...props.schema?.apiParams,
            });
            if (res && res.data) {
                // 单选/复选
                sourceList.value = res.data;
                showList.value = sourceList.value;
            }
        } else {
            // 静态赋值
            sourceList.value = props.schema.options as Options[];
            showList.value = sourceList.value;
        }
    }

    /**
     * 打开弹出层
     */
    function handlePopupOpen() {
        // 静态赋值时需要二次触发才能拿到数据
        if (!props.schema.api) {
            handleSearchSelect();
        }

        // 只有 label 时也可反显上一次选择的值
        if (selectLabel.value) {
            switch (selectType.value) {
                case 'radio':
                    sourceList.value.forEach((item: Options) => {
                        if (item.label === selectLabel.value) {
                            radioValue.value = item.value;
                        }
                    });
                    break;

                case 'checkbox':
                    let boxValue: any = [];
                    sourceList.value.forEach((item: Options) => {
                        String(selectLabel.value)
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
            if (props.schema?.attributes?.multiple) {
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
        // 双向绑定，无需手动赋值
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
                const isShow = showList.value.map((item: Options) => item.value).includes(filterList[i]);
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

                // 若存在于当前展示的下拉列表，且被本次选中
                if (isShow && isSelect) {
                    lastCheckboxValue.value.push(filterList[i]);
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
    function handleConfirm() {
        switch (selectType.value) {
            case 'radio':
                let label: string = '';
                sourceList.value.forEach((item: Options) => {
                    if (String(radioValue.value) === String(item.value)) {
                        label = item.label;
                    }
                });
                selectLabel.value = label;

                emit('handleSelect', {
                    value: { label: selectLabel.value, value: radioValue.value },
                    schema: props.schema,
                    isClear: false,
                });
                break;

            case 'checkbox':
                let labelList: string[] = [];
                sourceList.value.forEach((item: Options) => {
                    checkboxValue.value.forEach(value => {
                        if (value === item.value) {
                            labelList.push(item.label);
                        }
                    });
                });
                selectLabel.value = labelList.toString();

                emit('handleSelect', {
                    value: { label: selectLabel.value, value: checkboxValue.value },
                    schema: props.schema,
                    isClear: false,
                });
                break;
        }

        handlePopupClose();
    }

    /**
     * 取消选择
     */
    function handleCancel() {
        handlePopupClose();
    }

    /**
     * 处理选中的 value 与 label
     */
    function handleValueAndLabel(val: string | number | string[]) {
        if (!val) {
            return;
        }

        if (selectType.value === 'radio') {
            radioValue.value = val as string | number;
            sourceList.value.forEach((item: Options) => {
                if (item.value === val) {
                    selectLabel.value = item.label;
                }
            });
        } else {
            checkboxValue.value = val as string[];
            let labelList: string[] = [];
            sourceList.value.forEach((item: Options) => {
                checkboxValue.value?.forEach(value => {
                    if (value === item.value) {
                        labelList.push(item.label);
                    }
                });
            });

            selectLabel.value = labelList.toString();
        }
    }

    /**
     * 页面渲染
     */
    onBeforeMount(() => {
        // 下拉列表赋值
        handleSearchSelect();

        // 单选 or 多选
        if (props.schema?.attributes?.multiple) {
            selectType.value = 'checkbox';
        } else {
            selectType.value = 'radio';
        }

        // 默认值
        if (props.schema?.attributes?.defaultValue) {
            // 回显 label 与 value
            handleValueAndLabel(props.schema?.attributes?.defaultValue);

            emit('handleSelect', {
                value: { label: selectLabel.value, value: checkboxValue.value },
                schema: props.schema,
                isClear: false,
            });
        }
    });

    return {
        selectType,
        selectLabel,
        sourceList,
        showPopup,
        keyword,
        radioValue,
        checkboxValue,
        showList,
        handleClear,
        handlePopupOpen,
        handlePopupClose,
        handleConfirm,
        handleCancel,
        handleSearchSearch,
        handleSearchClear,
        handleRadioChange,
        handleCheckChange,
        handleSearchSelect,
        handleValueAndLabel,
    };
}
