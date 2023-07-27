import { get, post } from '@/utils/uni-request';

export default {
    /**
     * app-登录
     */
    login: (data: any) => post('/api/v1/user/manage/login', data),
    /**
     * 退出登录
     */
    logout: () => get('/api/v1/user/manage/logout'),
    /**
     * 修改用户密码
     */
    changePassword: (data?: any) => {
        return post('/api/v1/user/manage/changePassword', data);
    },
};
