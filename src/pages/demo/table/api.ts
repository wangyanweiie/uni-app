import { get, post } from '@/utils/uni-request';

export default {
    /**
     * 查询
     */
    index: (data: any) => get('/audit/log/list', data),
};
