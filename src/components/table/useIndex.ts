import { ref, onMounted, onUnmounted, watch } from 'vue';
import type {
    XTableProp,
    HeaderItem,
    Pagination,
    PaginationChangeParams,
    FixedStyleFunReturn,
    ValidateFunReturn,
} from './interface';

/**
 * @description useIndex
 * @param props 组件传参
 * @param emit 自定义事件
 */
export default function useIndex(props: Partial<XTableProp>, emit: any) {
    /**
     * key
     */
    const key = ref<number>(0);

    /**
     * ref
     */
    const uniTableRef = ref<any>();

    /**
     * loading
     */
    const tableLoading = ref<boolean>(false);

    /**
     * 表格数据
     */
    const tableData = ref<Record<string, any>[]>([]);

    /**
     * 勾选行数据
     */
    const checkRows = ref<Record<string, any>[]>([]);

    /**
     * @description 点击行
     * @param row 行数据
     */
    function handleRowClick(row: Record<string, any>) {
        emit('rowClick', row);
    }

    /**
     * @description 改变勾选行
     * @param e $event
     */
    function handleSelectionChange(e: Record<string, any>) {
        checkRows.value = [];

        // e.detail.index 勾选行的索引列表
        if (e.detail.index.length) {
            e.detail.index.forEach((item: number) => {
                checkRows.value.push(tableData.value[item]);
            });
        }
    }

    /**
     * @description 清空勾选行
     */
    function clearSelection() {
        checkRows.value = [];
        uniTableRef.value.clearSelection();
    }

    /**
     * 查询条件
     */
    const queryParams = ref<Record<string, string | number>>({});

    /**
     * 分页设置
     */
    const pagination = ref<Pagination>({
        pageSize: 10,
        page: 1,
        total: 0,
    });

    /**
     * @description 初始化表格数据
     * @param query 查询条件
     */
    async function loadData(query: Record<string, string | number> = {}): Promise<void> {
        clearSelection();

        // 保存请求的查询条件，分页时切换页码时作为入参
        queryParams.value = query;

        // 更新每页渲染数量
        pagination.value.pageSize = props.paginationProp?.pageSize || 10;

        if (props.api && props.dividePage) {
            // 1.动态赋值，分页接口
            tableLoading.value = true;

            const params = {
                ...props.apiParams,
                ...query,
                [props.apiKeyMap?.queryCurrentPageKey || 'page']: pagination.value.page,
                [props.apiKeyMap?.queryPageSizeKey || 'limit']: pagination.value.pageSize,
            };

            const res: any = await props.api(params);

            if (!res) {
                tableLoading.value = false;
                return;
            }

            // 当在指定页查询时，若查询到的页数 pages 大于零且小于当前所在页 current，则置为第一页重新查询
            if (
                res.data[props.apiKeyMap?.returnCurrentPageKey || 'current'] >
                    res.data[props.apiKeyMap?.returnPagesKey || 'pages'] &&
                res.data[props.apiKeyMap?.returnPagesKey || 'pages'] > 0
            ) {
                pagination.value.page = 1;
                loadData(queryParams.value);
            } else {
                pagination.value.page = res.data[props.apiKeyMap?.returnCurrentPageKey || 'current'];
                pagination.value.total = res.data[props.apiKeyMap?.returnTotalKey || 'total'];
                tableData.value = res.data[props.apiKeyMap?.returnRecordKey || 'records'] || [];
                tableLoading.value = false;
            }
        } else if (props.api && !props.dividePage) {
            // 2.动态赋值，非分页接口，不渲染分页
            tableLoading.value = true;
            pagination.value.pageSize = -1;

            const params = {
                ...props.apiParams,
                ...query,
            };

            const res: any = await props.api(params);

            if (!res) {
                tableLoading.value = false;
                return;
            }

            tableData.value = res.data || [];
            tableLoading.value = false;
        } else if (!props.api && props.dividePage && props.tableDataProp?.length) {
            // 3.静态赋值，假分页
            pagination.value.page = 1;
            pagination.value.total = props.tableDataProp.length;
            tableData.value = props.tableDataProp.slice(0, pagination.value.pageSize);
        } else if (!props.api && !props.dividePage && props.tableDataProp?.length) {
            // 4.静态赋值，不渲染分页
            pagination.value.pageSize = -1;
            tableData.value = props.tableDataProp;
        } else {
            // 5.置空，不渲染分页
            pagination.value.pageSize = -1;
            tableData.value = [];
        }

        key.value++;
        tableLoading.value = false;
    }

    /**
     * @description 假分页
     */
    function handleFalsePage(): void {
        const skipNum: number = (pagination.value.page - 1) * pagination.value.pageSize;
        tableData.value =
            skipNum + pagination.value.page >= props.tableDataProp!.length
                ? props.tableDataProp!.slice(skipNum, props.tableDataProp!.length)
                : props.tableDataProp!.slice(skipNum, skipNum + pagination.value.pageSize);
    }

    /**
     * @description 页面切换
     * @param e $event
     */
    function handlePaginationChange(e: PaginationChangeParams): void {
        pagination.value.page = e.current;

        if (props.api) {
            loadData(queryParams.value);
        } else {
            handleFalsePage();
        }
    }

    /**
     * FIXME: 虽然实现了需求，但方式不可行
     * @description 设置固定列样式
     * @param direction 固定方向
     * @param distance 固定距离
     * @param color 背景颜色
     * @returns Partial<FixedStyleFunReturn>
     */
    function handleFixed(direction: string = '', distance: string = '0', color: string): Partial<FixedStyleFunReturn> {
        switch (direction) {
            case 'left':
                return {
                    position: 'sticky',
                    left: distance,
                    backgroundColor: color,
                    zIndex: 2,
                };

            case 'right':
                return {
                    position: 'sticky',
                    right: distance,
                    backgroundColor: color,
                    zIndex: 2,
                };

            default:
                return {};
        }
    }

    /**
     * @description 校验必填列的值均不为空
     * @returns ValidateFunReturn
     */
    function validate(): ValidateFunReturn {
        let rowIndex: number = 0;
        let field: string = '';
        let flag: boolean = true;

        // "!" => 非空断言操作符，可以断言一个变量一定不为 null 或者 undefined，从而避免出现类型错误
        const requiredList = props.tableHeader!.filter((headerItem: HeaderItem) => headerItem?.required === true);
        const requiredPropList = requiredList.map((headerItem: HeaderItem) => headerItem.prop);

        tableData.value.forEach((item: Record<string, any>, index: number) => {
            rowIndex = index;

            for (const key in item) {
                if (requiredPropList.includes(key) && !item[key] && item[key] !== 0) {
                    field = key;
                    flag = false;
                    return false;
                }
            }
        });

        return {
            index: rowIndex,
            field,
            flag,
        };
    }

    /**
     * 图片预览
     */
    function handlePreview(url: string) {
        uni.previewImage({
            urls: [url],
        });
    }

    /**
     * 监听 tableDataProp
     * 静态赋值时需要二次赋值才能拿到数据
     * 导致问题：由于一直监听，嵌套输入框输入时，每输入一个字符都会刷新列表，导致输入框失焦
     * 解决办法：暂时通过在指定页面手动调用 loadData 进行二次赋值
     */
    // const stopWatchTableDataProp = watch(
    //     () => props.tableDataProp,
    //     (newValue: Record<string, any>[]) => {
    //         loadData({});
    //     },
    //     {
    //         deep: true,
    //     }
    // );

    /**
     * 页面挂载
     */
    onMounted(() => {
        loadData({});
    });

    /**
     * 页面卸载
     */
    // onUnmounted(() => {
    //     stopWatchTableDataProp();
    // });

    return {
        key,
        uniTableRef,
        tableLoading,
        tableData,
        checkRows,
        handleRowClick,
        handleSelectionChange,
        clearSelection,
        pagination,
        loadData,
        handlePaginationChange,
        handleFixed,
        validate,
        handlePreview,
    };
}
