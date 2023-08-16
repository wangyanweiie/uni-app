import { get } from '@/utils/uni-request';

export default {
    // 条码信息查看
    cylinderInfoScan: (params?: Record<string, any>) => {
        return get('/app/cylinder/getAppVoByCylinderCode', params);
    },
};
