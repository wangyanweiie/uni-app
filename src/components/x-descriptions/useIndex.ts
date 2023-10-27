import { ref, onMounted, onUnmounted, watch } from 'vue';
import type { Pagination, PaginationChangeParams, XDescriptionColumn, XDescriptionProp } from './interface';

/**
 * @description useIndex
 * @param props 组件传参
 * @param emit 自定义事件
 */
export default function useIndex(props: Partial<XDescriptionProp>, emit: any) {
    /**
     * key
     */
    const key = ref<number>(0);

    /**
     * col-span
     */
    function colSpan(data: XDescriptionColumn[]) {
        switch (data.length) {
            case 1:
                return 24;
            case 2:
                return 12;
            case 3:
                return 8;
        }
    }

    /**
     * 描述列列表数据
     */
    const descriptionsData = ref<Record<string, any>[]>([]);

    /**
     * @description 点击行
     * @param row 行数据
     */
    function handleRowClick(row: Record<string, any>) {
        emit('rowClick', row);
    }

    /**
     * 查询条件
     */
    const searchData = ref<Record<string, string | number>>({});

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
        // 保存请求的查询条件，分页时切换页码时作为入参
        searchData.value = query;

        // 更新每页渲染数量
        pagination.value.pageSize = props.paginationProp?.pageSize || 10;

        if (props.api && props.dividePage) {
            // 1.动态赋值，分页接口
            const params = {
                ...props.apiParams,
                ...query,
                [props.apiKeyMap?.queryCurrentPageKey || 'page']: pagination.value.page,
                [props.apiKeyMap?.queryPageSizeKey || 'limit']: pagination.value.pageSize,
            };

            const res: any = await props.api(params);

            if (!res) {
                return;
            }

            // 当在指定页查询时，若查询到的页数 pages 大于零且小于当前所在页 current，则置为第一页重新查询
            if (
                res.data[props.apiKeyMap?.returnCurrentPageKey || 'current'] >
                    res.data[props.apiKeyMap?.returnPagesKey || 'pages'] &&
                res.data[props.apiKeyMap?.returnPagesKey || 'pages'] > 0
            ) {
                pagination.value.page = 1;
                loadData(searchData.value);
            } else {
                pagination.value.page = res.data[props.apiKeyMap?.returnCurrentPageKey || 'current'];
                pagination.value.total = res.data[props.apiKeyMap?.returnTotalKey || 'total'];
                descriptionsData.value = res.data[props.apiKeyMap?.returnRecordKey || 'records'] || [];
            }
        } else if (props.api && !props.dividePage) {
            // 2.动态赋值，非分页接口，不渲染分页
            pagination.value.pageSize = -1;

            const params = {
                ...props.apiParams,
                ...query,
            };

            const res: any = await props.api(params);

            if (!res) {
                return;
            }

            descriptionsData.value = res.data || [];
        } else if (!props.api && props.dividePage && props.data?.length) {
            // 3.静态赋值，假分页
            pagination.value.page = 1;
            pagination.value.total = props.data.length;
            descriptionsData.value = props.data.slice(0, pagination.value.pageSize);
        } else if (!props.api && !props.dividePage && props.data?.length) {
            // 4.静态赋值，不渲染分页
            pagination.value.pageSize = -1;
            descriptionsData.value = props.data;
        } else {
            // 5.置空，不渲染分页
            pagination.value.pageSize = -1;
            descriptionsData.value = [];
        }

        key.value++;
    }

    /**
     * @description 假分页
     */
    function handleFalsePage(): void {
        const skipNum: number = (pagination.value.page - 1) * pagination.value.pageSize;
        descriptionsData.value =
            skipNum + pagination.value.page >= props.data!.length
                ? props.data!.slice(skipNum, props.data!.length)
                : props.data!.slice(skipNum, skipNum + pagination.value.pageSize);
    }

    /**
     * @description 页面切换
     * @param e $event
     */
    function handlePaginationChange(e: PaginationChangeParams): void {
        pagination.value.page = e.current;

        if (props.api) {
            loadData(searchData.value);
        } else {
            handleFalsePage();
        }
    }

    /**
     * 图片预览
     */
    function handlePreview(url: string) {
        uni.previewImage({
            urls: [url],
            current: 0,
        });
    }

    /**
     * 监听 data
     * 静态赋值时需要二次赋值才能拿到数据
     * 导致问题：由于一直监听，嵌套输入框输入时，每输入一个字符都会刷新列表，导致输入框失焦
     * 解决办法：暂时通过在指定页面手动调用 loadData 进行二次赋值
     */
    const stopWatchdata = watch(
        () => props.data as Record<string, any>[],
        (newValue: Record<string, any>[]) => {
            console.log(newValue);
            loadData();
        },
        {
            deep: true,
        },
    );

    /**
     * 页面挂载
     */
    onMounted(() => {
        loadData();
    });

    /**
     * 页面卸载
     */
    onUnmounted(() => {
        stopWatchdata();
    });

    return {
        key,
        colSpan,
        descriptionsData,
        handleRowClick,
        pagination,
        loadData,
        handlePaginationChange,
        handlePreview,
    };
}
