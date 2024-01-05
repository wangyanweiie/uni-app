import { createI18n } from 'vue-i18n';
import zhCn from './language/zh-cn';
import zhTw from './language/zh-tw';
import en from './language/en';
import { getStorage } from '@/utils/uni-storage';
import { LOCAL_LANGUAGE_KEY } from '@/constant/global';

const messages = {
    'zh-cn': zhCn,
    'zh-tw': zhTw,
    en: en,
};

const i18n = createI18n({
    // 使用 composition API
    legacy: false,
    // 语言
    locale: getStorage(LOCAL_LANGUAGE_KEY) || 'zh-cn',
    // 表明使用全局 t 函数
    globalInjection: true,
    messages,
});

export default i18n;
