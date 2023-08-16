import { get } from '@/utils/uni-request';

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
    getUserName: (): Promise<any> => commonSelect(166, 'user_name'),

    /**
     * 公司名称
     */
    getCompany: (): Promise<any> => commonSelect(48, 'name'),
};
