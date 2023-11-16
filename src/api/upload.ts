import { post } from '@/utils/uni-request';

export default {
    uploadBase64: (params?: Record<string, any>) => {
        return post('/api/upload/base64', params);
    },
};
