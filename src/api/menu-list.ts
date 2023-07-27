import { get, post } from '@/utils/uni-request';

/**
 * 公共下拉
 * @param type
 * @param field
 * @returns
 */
export function commonSelect(type: number, field: string): Promise<any> {
    return get('/common/getPullDownOne', {
        type,
        field,
    });
}

export default {
    /**
     * 用户列表
     */
    getUser: (): Promise<any> => get('/api/v1/user/manage/select'),

    /**
     * 公司名称
     */
    getCompany: (): Promise<any> => commonSelect(48, 'name'),
};
