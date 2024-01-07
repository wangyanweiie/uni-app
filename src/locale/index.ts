import { createI18n } from 'vue-i18n';
import { getStorage } from '@/utils/uni-storage';
import { LOCAL_LANGUAGE_KEY } from '@/constant/global';
import zhHans from './zh-Hans.json';
import zhHant from './zh-Hant.json';
import en from './en.json';

const messages = {
    'zh-Hans': zhHans,
    'zh-Hant': zhHant,
    en: en,
};

const i18n = createI18n({
    // 使用 composition API
    legacy: false,
    // 语言
    // locale: getStorage(LOCAL_LANGUAGE_KEY) || 'zh-cn',
    locale: uni.getLocale(),
    // 表明使用全局 t 函数
    globalInjection: true,
    // 语言包
    messages,
});

export default i18n;
